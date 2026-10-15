from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.medication import Medication
from app.models.user import App_User
from app.schemas.medication import (
    MedicationCreate,
    MedicationUpdate,
    MedicationResponse
)
from app.routers.auth import get_curr_user


router = APIRouter(
    prefix="/api/medications",
    tags=["medications"]
)


@router.post("/", response_model=MedicationResponse, status_code=status.HTTP_201_CREATED)
def create_medication(
    medication: MedicationCreate,
    db: Session = Depends(get_db),
    curr_user: App_User = Depends(get_curr_user)
):
    new_medication = Medication(
        **medication.model_dump(),
        user_id=curr_user.id
    )

    db.add(new_medication)
    db.commit()
    db.refresh(new_medication)

    return new_medication


@router.get("/", response_model=list[MedicationResponse])
def get_medications(
    db: Session = Depends(get_db),
    curr_user: App_User = Depends(get_curr_user)
):
    medications = db.query(Medication).filter(
        Medication.user_id == curr_user.id
    ).all()

    return medications


@router.get("/{med_id}", response_model=MedicationResponse)
def get_medication(
    med_id: int,
    db: Session = Depends(get_db),
    curr_user: App_User = Depends(get_curr_user)
):
    medication = db.query(Medication).filter(
        Medication.id == med_id,
        Medication.user_id == curr_user.id
    ).first()

    if not medication:
        raise HTTPException(
            status_code=404,
            detail="Medication not found."
        )

    return medication


@router.patch("/{med_id}", response_model=MedicationResponse)
def update_medication(
    med_id: int,
    medication_update: MedicationUpdate,
    db: Session = Depends(get_db),
    curr_user: App_User = Depends(get_curr_user)
):
    medication = db.query(Medication).filter(
        Medication.id == med_id,
        Medication.user_id == curr_user.id
    ).first()

    if not medication:
        raise HTTPException(
            status_code=404,
            detail="Medication not found."
        )

    update_data = medication_update.model_dump(exclude_unset=True)

    required_fields = {
        "med_name", "dosage", "pills_per_dose",
        "recurrence", "start_date", "is_refillable"
    }

    for field, value in update_data.items():
        if field in required_fields and value is None:
            raise HTTPException(
                status_code=422,
                detail=f"{field} cannot be null."
            )

        setattr(medication, field, value)

    db.commit()
    db.refresh(medication)

    return medication


@router.delete("/{med_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medication(
    med_id: int,
    db: Session = Depends(get_db),
    curr_user: App_User = Depends(get_curr_user)
):
    medication = db.query(Medication).filter(
        Medication.id == med_id,
        Medication.user_id == curr_user.id
    ).first()

    if not medication:
        raise HTTPException(
            status_code=404,
            detail="Medication not found."
        )

    db.delete(medication)
    db.commit()


