from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import App_User
from app.models.user_allergy import UserAllergy
from app.schemas.user_allergy import (
    UserAllergyCreate,
    UserAllergyUpdate,
    UserAllergyResponse,
)
from app.routers.auth import get_curr_user


#router setup
router = APIRouter(
    prefix="/api/allergies",
    tags=["allergies"]
)


#POST create allergen
@router.post("/", response_model=UserAllergyResponse, status_code=status.HTTP_201_CREATED)
def create_allergy(
    allergy: UserAllergyCreate,
    db: Session = Depends(get_db),
    curr_user: App_User = Depends(get_curr_user)
):
    allergy_name = allergy.name.strip()
    reaction = allergy.reaction.strip()

    #check if fields are empty
    if not allergy_name or not reaction:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Allergen name and reaction cannot be empty."
        )

    #check for duplicate allergens
    existing_allergy = db.query(UserAllergy).filter(
        UserAllergy.user_id == curr_user.id,
        func.lower(UserAllergy.name) == allergy_name.lower()
    ).first()

    if existing_allergy:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This allergen is already in your allergy list."
        )

    #save allergen
    new_allergy = UserAllergy(
        user_id=curr_user.id,
        name=allergy_name,
        reaction=reaction,
        severity=allergy.severity,
        note=allergy.note
    )

    db.add(new_allergy)
    db.commit()
    db.refresh(new_allergy)

    return new_allergy


#GET user allergens
@router.get("/", response_model=list[UserAllergyResponse])
def get_allergies(
    db: Session = Depends(get_db),
    curr_user: App_User = Depends(get_curr_user)
):
    #get allergens for current user
    allergies = db.query(UserAllergy).filter(
        UserAllergy.user_id == curr_user.id
    ).order_by(UserAllergy.name.asc()).all()

    return allergies


#PUT update allergen
@router.put("/{allergy_id}", response_model=UserAllergyResponse)
def update_allergy(
    allergy_id: int,
    allergy: UserAllergyUpdate,
    db: Session = Depends(get_db),
    curr_user: App_User = Depends(get_curr_user)
):
    #find allergen
    existing_allergy = db.query(UserAllergy).filter(
        UserAllergy.allergy_id == allergy_id,
        UserAllergy.user_id == curr_user.id
    ).first()

    if not existing_allergy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Allergen not found."
        )

    update_data = allergy.model_dump(exclude_unset=True)

    #check required fields
    for field in ("name", "reaction"):
        if field in update_data:
            value = update_data[field]

            if not isinstance(value, str) or not value.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"{field.capitalize()} cannot be empty."
                )

            update_data[field] = value.strip()

    if "severity" in update_data and update_data["severity"] is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Severity cannot be empty."
        )

    #check for duplicate name
    if "name" in update_data:
        duplicate = db.query(UserAllergy).filter(
            UserAllergy.user_id == curr_user.id,
            func.lower(UserAllergy.name) == update_data["name"].lower(),
            UserAllergy.allergy_id != allergy_id
        ).first()

        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This allergen is already in your allergy list."
            )

    #update allergen
    for field, value in update_data.items():
        setattr(existing_allergy, field, value)

    db.commit()
    db.refresh(existing_allergy)

    return existing_allergy


#DELETE allergen
@router.delete("/{allergy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_allergy(
    allergy_id: int,
    db: Session = Depends(get_db),
    curr_user: App_User = Depends(get_curr_user)
):
    #find allergen
    existing_allergy = db.query(UserAllergy).filter(
        UserAllergy.allergy_id == allergy_id,
        UserAllergy.user_id == curr_user.id
    ).first()

    if not existing_allergy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Allergen not found."
        )

    #delete allergen
    db.delete(existing_allergy)
    db.commit()

    return None
