from pydantic import BaseModel
from typing import Optional


class PharmacyResult(BaseModel):
    id: str                           #Google's place id
    name: str                         #e.x "Walgreens"
    address: Optional[str] = None
    distance: str                     #e.x "0.4 mi"
    phone: Optional[str] = None
    opens: Optional[str] = None       #today's hours, "HH:MM" (None = closed today or unknown)
    closes: Optional[str] = None
    is24Hours: bool = False
    latitude: float                   #where to put the pin on the map
