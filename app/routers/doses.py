#doses
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.medication import DoseLog, Medication
from app.models.user import App_User
from app.routers.auth import get_curr_user
from app.schemas.medication import DoseToggle, DoseResponse, DoseToggleResponse


router = APIRouter(
    prefix="/api/doses",
    tags=["doses"]
)


# GET /api/doses?dose_date=2026-11-10 -> the doses already marked taken that day
@router.get("/", response_model=list[DoseResponse])
def get_taken_doses(dose_date: Optional[date] = None, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    if dose_date is None:
        dose_date = date.today()

    return db.query(DoseLog).join(Medication, DoseLog.med_id == Medication.id).filter(
        Medication.user_id == curr_user.id,
        DoseLog.dose_date == dose_date
    ).all()


# POST /api/doses/toggle -> checks or unchecks one dose
@router.post("/toggle", response_model=DoseToggleResponse)
def toggle_dose(dose: DoseToggle, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    medication = db.query(Medication).filter(Medication.id == dose.med_id, Medication.user_id == curr_user.id).first()

    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found.")

    existing = db.query(DoseLog).filter(
        DoseLog.med_id == dose.med_id,
        DoseLog.dose_date == dose.dose_date,
        DoseLog.dose_time == dose.dose_time
    ).first()

    # already taken -> uncheck it and put the pills back
    if existing:
        db.delete(existing)
        if medication.pill_qty is not None:
            medication.pill_qty += medication.pills_per_dose
        db.commit()
        return DoseToggleResponse(taken=False)

    # not taken yet -> mark it taken and take the pills off the count
    new_log = DoseLog(med_id=dose.med_id, dose_date=dose.dose_date, dose_time=dose.dose_time)
    if medication.pill_qty is not None:
        medication.pill_qty -= medication.pills_per_dose

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return DoseToggleResponse(taken=True, taken_at=new_log.taken_at)
