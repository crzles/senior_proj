from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import date

#create/request model: defines only what a client needs to send
#response model: controls exactly what data gets sent back from client,
#protecting sensitive fields

class SymptomCreate(BaseModel):
    name: str = Field(min_length=1, max_length=50)


class SymptomResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class SymptomLogCreate(BaseModel):
    symptom_id: int
    med_id: Optional[int] = None
    logged_on: Optional[date] = None
    note: Optional[str] = None

class SymptomLogResponse(BaseModel):
    id: int
    user_id: int
    symptom_id: int
    med_id: Optional[int] = None
    logged_on: date
    note: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
