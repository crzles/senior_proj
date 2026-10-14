from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.medication import Medication, Reminder
from app.models.user import App_User
from app.routers.auth import get_curr_user
from app.schemas.medication import ReminderCreate, ReminderResponse, ReminderUpdate


router = APIRouter(
    prefix="/api/medications/{med_id}/reminders",
    tags=["reminders"]
)


# GET /
@router.get("/", response_model=list[ReminderResponse])
def get_reminders(med_id: int, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    medication = db.query(Medication).filter(Medication.id==med_id, Medication.user_id==curr_user.id).first()

    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found.")

    reminders = db.query(Reminder).filter(Reminder.med_id==med_id).order_by(Reminder.dose_time).all()
    return reminders


# POST /
@router.post("/", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
def create_reminder(med_id: int, reminder: ReminderCreate, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    medication = db.query(Medication).filter(Medication.id==med_id, Medication.user_id==curr_user.id).first()

    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    new_reminder = Reminder(dose_time=reminder.dose_time, med_id=med_id)

    db.add(new_reminder)
    db.commit()
    db.refresh(new_reminder)
        
    return new_reminder



# PATCH /{id}
@router.patch("/{reminder_id}", response_model=ReminderResponse)
def update_reminder(med_id: int, reminder_id: int, update: ReminderUpdate, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    medication = db.quer(Medication).filter(Medication.id==med_id, Medication.user_id==curr_user.id).first()

    if not medication:
        raise HTTPException(status_code=404, details="Medication not found.")

    reminder = db.query(Reminder).filter(Reminder.id==reminder_id, Reminder.med_id==med_id).first()

    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found.")
    
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(reminder, field, value)
    
    db.commit()
    db.refresh(reminder)

    return reminder



# DELETE /{id}
@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(med_id: int, reminder_id: int, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    medication = db.query(Medication).filter(Medication.id==med_id, Medication.user_id==curr_user.id).first()

    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found.")
    
    reminder = db.query(Reminder).filter(Reminder.id==reminder_id, Reminder.med_id==med_id).first()

    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found.")

    db.delete(reminder)
    db.commit()