from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime, time
from typing import Optional, Literal

class RefillCreate(BaseModel):
    refilled_at: Optional[datetime] = None
    qty_added: int
    dosage: Optional[str] = Field(default=None, max_length=80)
    pharmacy_name: Optional[str] = None
    pharmacy_address: Optional[str] = None

class RefillResponse(BaseModel):
    id: int
    med_id: int
    refilled_at: datetime
    qty_added: int
    dosage: Optional[str] = None
    pharmacy_name: Optional[str] = None
    pharmacy_address: Optional[str] = None
    

    model_config = ConfigDict(from_attributes=True)

class ReminderCreate(BaseModel):
    dose_time: time

class ReminderUpdate(BaseModel):
    dose_time: Optional[time] = None
    is_active: Optional[bool] = None

class ReminderResponse(BaseModel):
    id: int
    med_id: int
    dose_time: time
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class DoseLogUpdate(BaseModel):
    status: Literal["taken", "skipped"] #taken/skip buttons


class DoseLogResponse(BaseModel):
    id: int
    reminder_id: int
    scheduled_for: datetime
    status: Literal["pending", "taken", "skipped", "missed"] #buttons
    taken_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)