from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.health import Symptom, SymptomLog
from app.models.user import App_User
from app.routers.auth import get_curr_user
from app.routers.medication import get_user_med
from app.schemas.health import (
    SymptomCreate,
    SymptomLogCreate,
    SymptomLogResponse,
    SymptomResponse,
)

router = APIRouter(prefix="/symptoms", tags=["symptoms"])

# NOTE: "/logs" routes are declared before nothing like "/{id}" exists here,
# so there is no path-matching conflict with "/".

# GET / (the list)
@router.get("/", response_model=list[SymptomResponse])
def list_symptoms(db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    return db.scalars(select(Symptom).order_by(Symptom.name)).all()


# POST / (add new name)
@router.post("/", response_model=SymptomResponse, status_code=status.HTTP_201_CREATED)
def create_symptom(symptom: SymptomCreate,db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    name = symptom.name.strip()
    if not name:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Symptom name cannot be blank")

    # the symptoms list is shared by all users, so compare case-insensitively #TODO:FIX!
    if db.scalar(select(Symptom.id).where(func.lower(Symptom.name) == name.lower())):
        raise HTTPException(status.HTTP_409_CONFLICT, "Symptom already exists")

    symptom = Symptom(name=name)
    db.add(symptom)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Symptom already exists")
    db.refresh(symptom)
    return symptom

# GET /logs
@router.get("/logs", response_model=list[SymptomLogResponse])
def list_symptom_logs(
symptom_id: Optional[int] = Query(None),
    med_id: Optional[int] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: App_User = Depends(get_curr_user),
):
    query = select(SymptomLog).where(SymptomLog.user_id == current_user.id)
    if symptom_id is not None:
        query = query.where(SymptomLog.symptom_id == symptom_id)
    if med_id is not None:
        query = query.where(SymptomLog.med_id == med_id)
    if start_date is not None:
        query = query.where(SymptomLog.logged_on >= start_date)
    if end_date is not None:
        query = query.where(SymptomLog.logged_on <= end_date)

    return db.scalars(query.order_by(SymptomLog.logged_on.desc(), SymptomLog.id.desc())).all()

#POST /logs
@router.post("/logs", response_model=SymptomLogResponse, status_code=status.HTTP_201_CREATED)
def create_symptom_log(
    payload: SymptomLogCreate,
    db: Session = Depends(get_db),
    current_user: App_User = Depends(get_curr_user),
):
    if db.get(Symptom, payload.symptom_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Symptom not found")
    if payload.med_id is not None:
        get_user_med(db, payload.med_id, current_user)  # 404 if not theirs

    # exclude_none so logged_on falls back to CURRENT_DATE in the DB
    log = SymptomLog(user_id=current_user.id, **payload.model_dump(exclude_none=True))
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

# DELETE /logs/{id}
@router.delete("/logs/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_symptom_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: App_User = Depends(get_curr_user),
):
    log = db.scalar(select(SymptomLog).where(SymptomLog.id == log_id, SymptomLog.user_id == current_user.id))
    if log is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Symptom log not found")
    db.delete(log)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


