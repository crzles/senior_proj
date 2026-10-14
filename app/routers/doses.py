#doses
from datetime import date, datetime, time, timedelta, timezone
from decimal import Decimal
from zoneinfo import ZoneInfo
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_, select, update
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.medication import DoseLog, Medication, Reminder
from app.models.user import App_User
from app.routers.auth import get_curr_user
from app.schemas.medication import DoseLogResponse, TodayDoseResponse


router = APIRouter(
    prefix="/api/doses",
    tags=["doses"]
)

#helper functions
def _is_due(recurrence: str, start: date, today: date) -> bool:
    # Add your frontend's recurrence values here.
    r = recurrence.strip().lower().replace("_", " ").replace("-", " ")
    days_since_start = (today - start).days
    if r == "weekly":
        return days_since_start % 7 == 0
    if r in ("every other day", "alternate days"):
        return days_since_start % 2 == 0
    return True

def _get_user_dose(db: Session, dose_id: int, user: App_User) -> tuple[DoseLog, Medication]:
    query = select(DoseLog, Medication)
    query = query.join(Reminder, DoseLog.reminder_id == Reminder.id)
    query = query.join(Medication, Reminder.med_id == Medication.id)
    query = query.where(DoseLog.id == dose_id)
    query = query.where(Medication.user_id == user.id)

    result = db.execute(query).first()
    if result is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Dose not found")

    dose, medication = result
    return dose, medication

def _mark_doses_missed(db: Session, user: App_User, day_start: datetime) -> None:
    user_reminder_ids = (
        select(Reminder.id)
        .join(Medication, Reminder.med_id == Medication.id)
        .where(Medication.user_id == user.id)
    )

    query = update(DoseLog)
    query = query.where(DoseLog.reminder_id.in_(user_reminder_ids))
    query = query.where(DoseLog.status == "pending")
    query = query.where(DoseLog.scheduled_for < day_start)
    query = query.values(status="missed")
    db.execute(query)

def _todays_doses(db: Session, user: App_User, today: date, zone: ZoneInfo) -> None:
    query = select(Reminder, Medication)
    query = query.join(Medication, Reminder.med_id == Medication.id)
    query = query.where(Medication.user_id == user.id)
    query = query.where(Reminder.is_active.is_(True))
    query = query.where(Medication.start_date <= today)
    query = query.where(or_(Medication.end_date.is_(None), Medication.end_date >= today))
 
    new_doses = []
    for reminder, med in db.execute(query).all():
        if not _is_due(med.recurrence, med.start_date, today):
            continue
        dose_time = reminder.dose_time.replace(tzinfo=None)
        new_doses.append({
            "reminder_id": reminder.id,
            "scheduled_for": datetime.combine(today, dose_time, tzinfo=zone),
        })
 
    if new_doses:
        insert = pg_insert(DoseLog).values(new_doses)
        insert = insert.on_conflict_do_nothing(constraint="unique_dose_logs_reminder_time")
        db.execute(insert)

def _load_todays_doses(db: Session, user: App_User, day_start: datetime, day_end: datetime):
    query = select(DoseLog, Medication)
    query = query.join(Reminder, DoseLog.reminder_id == Reminder.id)
    query = query.join(Medication, Reminder.med_id == Medication.id)
    query = query.where(Medication.user_id == user.id)
    query = query.where(DoseLog.scheduled_for >= day_start)
    query = query.where(DoseLog.scheduled_for < day_end)
    query = query.order_by(DoseLog.scheduled_for, Medication.med_name)
    return db.execute(query).all()

def _to_response(dose: DoseLog, med: Medication) -> TodayDoseResponse:
    return TodayDoseResponse(
        id=dose.id,
        reminder_id=dose.reminder_id,
        scheduled_for=dose.scheduled_for,
        status=dose.status,
        taken_at=dose.taken_at,
        remind_count=dose.remind_count,
        med_id=med.id,
        med_name=med.med_name,
        dosage=med.dosage,
        pills_per_dose=float(med.pills_per_dose),
    )

# ///////////////////////////////////////////////////////////////////////////////////////

# GET /today
@router.get("/today", response_model=list[TodayDoseResponse])
def get_today_doses(db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    # The user's saved timezone decides what "today" means for them.
    zone = ZoneInfo(curr_user.timezone)
    today = datetime.now(zone).date()
    day_start = datetime.combine(today, time.min, tzinfo=zone)
    day_end = datetime.combine(today + timedelta(days=1), time.min, tzinfo=zone)
 
    _mark_doses_missed(db, curr_user, day_start)
    _todays_doses(db, curr_user, today, zone)
    db.commit()
 
    rows = _load_todays_doses(db, curr_user, day_start, day_end)
    return [_to_response(dose, med) for dose, med in rows]


# POST /{id}/taken
@router.post("/{dose_id}/taken", response_model=DoseLogResponse)
def mark_dose_taken(dose_id: int, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    dose, med = _get_user_dose(db, dose_id, curr_user)
    if dose.status == "taken":
        raise HTTPException(status.HTTP_409_CONFLICT, "Dose already marked as taken")
 
    dose.status = "taken"
    dose.taken_at = datetime.now(timezone.utc)
    # keep the remaining supply in step (only if the user tracks it)
    if med.pill_qty is not None:
        med.pill_qty = max(Decimal(0), med.pill_qty - med.pills_per_dose)
 
    db.commit()
    db.refresh(dose)
    return dose


# POST /{id}/skip
@router.post("/{dose_id}/skip", response_model=DoseLogResponse)
def mark_dose_skipped(dose_id: int, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    dose, _ = _get_user_dose(db, dose_id, curr_user)
    if dose.status == "taken":
        raise HTTPException(status.HTTP_409_CONFLICT, "A taken dose can't be skipped")
 
    dose.status = "skipped"
    dose.taken_at = None
    db.commit()
    db.refresh(dose)
    return dose


