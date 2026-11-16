import datetime as dt
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Literal

#create/request model: defines only what a client needs to send
#response model: controls exactly what data gets sent back from client,
#protecting sensitive fields

Severity = Literal["Mild", "Moderate", "Severe"]

#Symptom log page form
class SymptomLogCreate(BaseModel):
    symptom: str = Field(min_length=1, max_length=100)
    date: dt.date
    time: dt.time
    severity: Severity
    duration: str = ""
    notes: str = ""

#editing an entry in the symptom history
class SymptomLogUpdate(BaseModel):
    symptom: Optional[str] = Field(default=None, min_length=1, max_length=100)
    severity: Optional[Severity] = None
    duration: Optional[str] = None
    notes: Optional[str] = None

class SymptomLogResponse(SymptomLogCreate):
    id: int
    logged_at: dt.datetime

    model_config = ConfigDict(from_attributes=True)
