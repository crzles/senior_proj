import math
from datetime import datetime
import httpx
from fastapi import APIRouter, Depends, HTTPException
from app.config import settings
from app.routers.auth import get_curr_user
from app.schemas.pharmacy import PharmacyResult

router = APIRouter(prefix="/api/pharmacies", tags=["pharmacies"])

#name, address, pin location, phone and opening hours (what the map page shows)
FIELD_MASK = "places.id,places.displayName,places.formattedAddress,places.location,places.nationalPhoneNumber,places.regularOpeningHours"


def miles_between(lat1, lng1, lat2, lng2):
    #straight-line distance (haversine formula)
    lat1, lng1, lat2, lng2 = map(math.radians, [lat1, lng1, lat2, lng2])
    a = math.sin((lat2 - lat1) / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin((lng2 - lng1) / 2) ** 2
    return 3958.8 * 2 * math.asin(math.sqrt(a))


def todays_hours(place):
    #returns (opens, closes, is_24_hours) for today, times as "HH:MM"
    periods = place.get("regularOpeningHours", {}).get("periods", [])

    #Google marks 24-hour places as one period with no closing time
    if len(periods) == 1 and "close" not in periods[0]:
        return None, None, True

    today = (datetime.now().weekday() + 1) % 7  #Google counts days from Sunday = 0
    for period in periods:
        if period["open"]["day"] == today:
            opens = period["open"]
            closes = period.get("close", {"hour": 23, "minute": 59})
            return f"{opens['hour']:02d}:{opens['minute']:02d}", f"{closes['hour']:02d}:{closes['minute']:02d}", False

    return None, None, False  #closed today or hours unknown


#GET /api/pharmacies/nearby?lat=41.88&lng=-87.63 -> pharmacies near the user, closest first
@router.get("/nearby", response_model=list[PharmacyResult])
def nearby_pharmacies(lat: float, lng: float, curr_user=Depends(get_curr_user)):
    response = httpx.post(
        "https://places.googleapis.com/v1/places:searchNearby",
        headers={
            "X-Goog-Api-Key": settings.GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask": FIELD_MASK,
        },
        json={
            "includedTypes": ["pharmacy"],
            "maxResultCount": 10,
            "rankPreference": "DISTANCE",
            "locationRestriction": {
                "circle": {"center": {"latitude": lat, "longitude": lng}, "radius": 8000}  # meters (about 5 miles)
            },
        },
    )
    if response.status_code != 200:
        print("Google Places error:", response.text)  #shows the real reason in the terminal
        raise HTTPException(status_code=502, detail="Couldn't load pharmacies right now.")

    results = []
    for p in response.json().get("places", []):
        opens, closes, is_24_hours = todays_hours(p)
        results.append(PharmacyResult(
            id=p["id"],
            name=p["displayName"]["text"],
            address=p.get("formattedAddress"),
            distance=f"{miles_between(lat, lng, p['location']['latitude'], p['location']['longitude']):.1f} mi",
            phone=p.get("nationalPhoneNumber"),
            opens=opens,
            closes=closes,
            is24Hours=is_24_hours,
            latitude=p["location"]["latitude"],
            longitude=p["location"]["longitude"],
        ))
    return results