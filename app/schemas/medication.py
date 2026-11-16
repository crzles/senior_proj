from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime, time, date
from decimal import Decimal
from typing import Optional, Literal

#times are sent as "HH:MM" strings, e.g. "08:00"
TIME_PATTERN = r"^\d{2}:\d{2}$"

class RefillCreate(BaseModel):
    refilled_at: Optional[datetime] = None
    qty_added: int = Field(gt=0)
    dosage: Optional[str] = Field(default=None, max_length=50)
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

#home page checkmark: marks one dose as taken / not taken
class DoseToggle(BaseModel):
    med_id: int
    dose_date: date
    dose_time: str = Field(pattern=TIME_PATTERN)

class DoseResponse(BaseModel):
    med_id: int
    dose_date: date
    dose_time: str
    taken_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DoseToggleResponse(BaseModel):
    taken: bool
    taken_at: Optional[datetime] = None
    
class MedicationBase(BaseModel):
    med_name: str
    med_type: Optional[str] = None
    dosage: str
    route: Optional[str] = None
    is_otc: Optional[bool] = None
    pills_per_dose: Decimal = Field(
        default=Decimal("1"),
        gt=0,
        max_digits=3,
        decimal_places=2
    )
    recurrence: str
    start_date: date = Field(default_factory=date.today)
    end_date: Optional[date] = None
    is_refillable: bool = False
    refill_reminder: Optional[int] = None
    pill_qty: Optional[Decimal] = Field(
        default=None,
        ge=0,
        max_digits=7,
        decimal_places=2
    )
    requirements: Optional[str] = None
    avoid_notes: Optional[str] = None
    storage_notes: Optional[str] = None
    label_set_id: Optional[str] = None


class MedicationCreate(MedicationBase):
    pass

class MedicationUpdate(BaseModel):
    med_name: Optional[str] = None
    med_type: Optional[str] = None
    dosage: Optional[str] = None
    route: Optional[str] = None
    is_otc: Optional[bool] = None
    pills_per_dose: Optional[Decimal] = Field(
        default=None,
        gt=0,
        max_digits=3,
        decimal_places=2
    )
    recurrence: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_refillable: Optional[bool] = None
    refill_reminder: Optional[int] = None
    pill_qty: Optional[Decimal] = Field(
        default=None,
        ge=0,
        max_digits=7,
        decimal_places=2
    )
    requirements: Optional[str] = None
    avoid_notes: Optional[str] = None
    storage_notes: Optional[str] = None
    label_set_id: Optional[str] = None


class MedicationResponse(MedicationBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
