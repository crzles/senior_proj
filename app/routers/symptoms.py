from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.health import SymptomLog
from app.models.user import App_User
from app.routers.auth import get_curr_user
from app.schemas.health import SymptomLogCreate, SymptomLogUpdate, SymptomLogResponse

router = APIRouter(
    prefix="/api/symptoms",
    tags=["symptoms"]
)

# GET / -> symptom history, newest first
@router.get("/", response_model=list[SymptomLogResponse])
def get_symptom_logs(db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    return db.query(SymptomLog).filter(SymptomLog.user_id==curr_user.id).order_by(SymptomLog.logged_at.desc()).all()

# POST / -> save the Symptom log form
@router.post("/", response_model=SymptomLogResponse, status_code=status.HTTP_201_CREATED)
def create_symptom_log(log: SymptomLogCreate, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    new_log = SymptomLog(**log.model_dump(), user_id=curr_user.id)

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return new_log

# PATCH /{id} -> edit an entry in the symptom history
@router.patch("/{log_id}", response_model=SymptomLogResponse)
def update_symptom_log(log_id: int, changes: SymptomLogUpdate, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    log = db.query(SymptomLog).filter(SymptomLog.id==log_id, SymptomLog.user_id==curr_user.id).first()

    if not log:
        raise HTTPException(status_code=404, detail="Symptom log not found.")

    for field, value in changes.model_dump(exclude_none=True).items():
        setattr(log, field, value)

    db.commit()
    db.refresh(log)

    return log

# DELETE /{id}
@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_symptom_log(log_id: int, db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    log = db.query(SymptomLog).filter(SymptomLog.id==log_id, SymptomLog.user_id==curr_user.id).first()

    if not log:
        raise HTTPException(status_code=404, detail="Symptom log not found.")

    db.delete(log)
    db.commit()


