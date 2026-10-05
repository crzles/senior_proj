from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class DrugLabelBase(BaseModel):
    set_id: str
    med_name: str
    generic_name: Optional[str] = None
    purpose: Optional[str] = None
    indications: Optional[str] = None
    dosage: Optional[str] = None
    storage: Optional[str] = None
    #warning from openFDA not our separate PillBug warning table
    warnings: Optional[str] = None
    boxed_warning: Optional[str] = None
    last_updated: Optional[datetime] = None

class DrugLabelResponse(DrugLabelBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True) 

