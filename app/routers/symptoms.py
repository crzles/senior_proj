from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.health import Symptom, SymptomLog
from app.models.medication import Medication
from app.models.user import App_User
from app.routers.auth import get_curr_user
from app.schemas.health import *

router = APIRouter(
    prefix="/api/symptoms",
    tags=["symptoms"]
)

# GET / (the list)
@router.get("/", response_model=list[SymptomResponse])
def get_symptoms(db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    return db.query(Symptom).order_by(Symptom.name).all()

# POST / (add new name)
@router.post("/", response_model=SymptomResponse, status_code=status.HTTP_201_CREATED)
def create_symptom(symptom: SymptomCreate, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    existing = db.query(Symptom).filter(Symptom.name==symptom.name).first()

    if existing:
        raise HTTPException(status_code=409, detail="Symptom already exists.")

    new_symptom = Symptom(name=symptom.name)

    db.add(new_symptom)
    db.commit()
    db.refresh(new_symptom)

    return new_symptom

# GET /logs
@router.get("/logs", response_model=list[SymptomLogResponse])
def get_symptom_logs(db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    logs = db.query(SymptomLog).filter(SymptomLog.user_id==curr_user.id).order_by(SymptomLog.logged_on.desc()).all()

    return logs

#POST /logs
@router.post("/logs", response_model=SymptomLogResponse, status_code=status.HTTP_201_CREATED)
def create_symptom_log(log: SymptomLogCreate, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):

    if log.med_id is not None:
        medication = db.query(Medication).filter(Medication.id==log.med_id, Medication.user_id==curr_user.id).first()

        if not medication:
            raise HTTPException(status_code=404, detail="Medication not found.")
        
    new_log = SymptomLog(**log.model_dump(exclude_none=True), user_id=curr_user.id)

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return new_log

# DELETE /logs/{id}
@router.delete("/logs/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_symptom_log(log_id: int, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    log = db.query(SymptomLog).filter(SymptomLog.id==log_id, SymptomLog.user_id==curr_user.id).first()

    if not log:
        raise HTTPException(status_code=404, detail="Symptom log not found.")

    db.delete(log)
    db.commit()


