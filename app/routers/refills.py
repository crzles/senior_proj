from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.medication import Medication, Refill
from app.models.user import App_User
from app.routers.auth import get_curr_user
from app.schemas.medication import RefillCreate, RefillResponse


router = APIRouter(
    prefix="/api/medications/{med_id}/refills",
    tags=["refills"]
)

#GET/
@router.get("/", response_model=list[RefillResponse])
def get_refills(med_id: int, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    medication = db.query(Medication).filter(Medication.id==med_id,Medication.user_id==curr_user.id).first()

    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found.")

    refills = db.query(Refill).filter(Refill.med_id == med_id).order_by(Refill.refilled_at.desc()).all()

    return refills


#POST/
@router.post("/", response_model=RefillResponse, status_code=status.HTTP_201_CREATED)
def create_refill(med_id: int, refill: RefillCreate, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    medication = db.query(Medication).filter(Medication.id == med_id, Medication.user_id == curr_user.id).first()

    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found.")

    new_refill = Refill(**refill.model_dump(exclude_none=True), med_id=med_id)

    # add refilled amount to the current supply
    medication.pill_qty = (medication.pill_qty or 0) + refill.qty_added

    db.add(new_refill)
    db.commit()
    db.refresh(new_refill)

    return new_refill
