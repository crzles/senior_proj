from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.medication import Reminder
from app.models.user import App_User
from app.routers.auth import get_curr_user
from app.routers.medication import get_user_med
from app.schemas.medication import ReminderCreate, ReminderResponse, ReminderUpdate


router = APIRouter(
    prefix="/api/medications/{med_id}/reminders",
    tags=["reminders"]
)

DUPLICATE_TIME = "This medication already has a reminder at that time"

#helper function
def _get_reminder(db: Session, med_id: int, reminder_id: int, user: App_User) -> Reminder:
    get_user_med(db, med_id, user)  # 404s if the med isn't the user's
    reminder = db.scalar(select(Reminder).where(Reminder.id == reminder_id, Reminder.med_id == med_id))
    if reminder is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Reminder not found")
    return reminder


# GET /
@router.get("/", response_model=list[ReminderResponse])
def list_reminders(med_id: int, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    get_user_med(db, med_id, curr_user)

    query = select(Reminder).where(Reminder.med_id == med_id)
    query = query.order_by(Reminder.dose_time)

    reminders = db.scalars(query).all()
    return reminders


# POST /
@router.post("/", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
def create_reminder(med_id: int, reminder: ReminderCreate, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    get_user_med(db, med_id, curr_user)
    reminder = Reminder(med_id=med_id, dose_time=reminder.dose_time)
    db.add(reminder)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, DUPLICATE_TIME)
    db.refresh(reminder)
    return reminder



# PATCH /{id}
@router.patch("/{reminder_id}", response_model=ReminderResponse)
def update_reminder(med_id: int, reminder_id: int, update: ReminderUpdate, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    reminder = _get_reminder(db, med_id, reminder_id, curr_user)
    data = update.model_dump(exclude_unset=True)

    if any(value is None for value in data.values()):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "dose_time and is_active cannot be null")

    for field, value in data.items():
        setattr(reminder, field, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, DUPLICATE_TIME)
    db.refresh(reminder)
    return reminder



# DELETE /{id}
@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(med_id: int, reminder_id: int, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    reminder = _get_reminder(db, med_id, reminder_id, curr_user)
    db.delete(reminder)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)