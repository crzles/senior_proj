#doses
from datetime import datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
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


#GET/today
@router.get("/today", response_model=list[TodayDoseResponse])
def get_today_doses(db: Session = Depends(get_db),curr_user: App_User = Depends(get_curr_user)):
    zone = ZoneInfo(curr_user.timezone)
    today = datetime.now(zone).date()
    day_start = datetime.combine(today, time.min, tzinfo=zone)
    day_end = datetime.combine(today + timedelta(days=1), time.min, tzinfo=zone)

    # active reminders that run for "today"
    reminders = db.query(Reminder).join(Medication, Reminder.med_id == Medication.id).filter(
        Medication.user_id == curr_user.id,
        Reminder.is_active.is_(True),
        Medication.start_date <= today,
        or_(Medication.end_date.is_(None), Medication.end_date >= today)
    ).all()

    for reminder in reminders:
        scheduled_for = datetime.combine(today, reminder.dose_time.replace(tzinfo=None), tzinfo=zone)

        existing = db.query(DoseLog).filter(
            DoseLog.reminder_id == reminder.id,
            DoseLog.scheduled_for == scheduled_for
        ).first()

        if not existing:
            db.add(DoseLog(reminder_id=reminder.id, scheduled_for=scheduled_for))

    db.commit()

    # get today's doses along with their medication info
    rows = db.query(DoseLog, Medication).join(Reminder, DoseLog.reminder_id == Reminder.id).join(Medication, Reminder.med_id == Medication.id).filter(
        Medication.user_id == curr_user.id,
        DoseLog.scheduled_for >= day_start,
        DoseLog.scheduled_for < day_end
    ).order_by(DoseLog.scheduled_for).all()

    doses = []
    for dose, med in rows:
        doses.append(TodayDoseResponse(
            id=dose.id,
            reminder_id=dose.reminder_id,
            scheduled_for=dose.scheduled_for,
            status=dose.status,
            taken_at=dose.taken_at,
            remind_count=dose.remind_count,
            med_id=med.id,
            med_name=med.med_name,
            dosage=med.dosage,
            pills_per_dose=float(med.pills_per_dose)
        ))

    return doses


# POST /{id}/taken
@router.post("/{dose_id}/taken", response_model=DoseLogResponse)
def mark_dose_taken(dose_id: int, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    dose = db.query(DoseLog).join(Reminder, DoseLog.reminder_id == Reminder.id).join(Medication, Reminder.med_id == Medication.id).filter(
        DoseLog.id == dose_id,
        Medication.user_id == curr_user.id
    ).first()

    if not dose:
        raise HTTPException(status_code=404, detail="Dose not found.")

    dose.status = "taken"
    dose.taken_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(dose)

    return dose


# POST /{id}/skip
@router.post("/{dose_id}/skip", response_model=DoseLogResponse)
def mark_dose_skipped(dose_id: int, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    dose = db.query(DoseLog).join(Reminder, DoseLog.reminder_id == Reminder.id).join(Medication, Reminder.med_id == Medication.id).filter(
        DoseLog.id == dose_id,
        Medication.user_id == curr_user.id
    ).first()

    if not dose:
        raise HTTPException(status_code=404, detail="Dose not found.")

    dose.status = "skipped"
    dose.taken_at = None

    db.commit()
    db.refresh(dose)

    return dose
