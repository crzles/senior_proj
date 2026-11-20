from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional, Literal


class UserAllergyCreate(BaseModel):
    name: str = Field(min_length=1)
    reaction: str = Field(min_length=1)
    severity: Literal["Mild", "Moderate", "Severe", "Unknown"]
    note: Optional[str] = None


class UserAllergyUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1)
    reaction: Optional[str] = Field(default=None, min_length=1)
    severity: Optional[Literal["Mild", "Moderate", "Severe", "Unknown"]] = None
    note: Optional[str] = None


class UserAllergyResponse(UserAllergyCreate):
    allergy_id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
