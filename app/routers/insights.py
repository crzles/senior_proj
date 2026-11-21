import json
from datetime import date, timedelta
import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.health import SymptomLog
from app.models.medication import DoseLog, Medication
from app.models.user import App_User
from app.routers.auth import get_curr_user

router = APIRouter(
    prefix="/api/insights",
    tags=["insights"]
)

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

SYSTEM_PROMPT = (
    "You are Rollie, the friendly insights assistant inside PillBug, a medication tracking app. "
    "You get a user's medications, how many doses they took, and their recent symptom log. "
    "Reply with ONLY a JSON object: {\"insights\": [{\"kind\": \"adherence\"|\"symptoms\"|\"refill\"|\"tip\", "
    "\"title\": short title, \"detail\": 1-2 plain-language sentences}]}. "
    "Give 3 to 5 insights. Point out adherence patterns, symptoms that may line up with medication times, "
    "and low pill counts. Be encouraging, never diagnose, never tell the user to start, stop or change a "
    "medication or dose; suggest asking a doctor or pharmacist for medical questions."
)


def build_summary(db: Session, user: App_User, days: int) -> dict:
    since = date.today() - timedelta(days=days - 1)
    meds = db.query(Medication).filter(Medication.user_id == user.id).all()

    med_summaries = []
    for med in meds:
        taken = db.query(DoseLog).filter(DoseLog.med_id == med.id, DoseLog.dose_date >= since).count()
        per_day = len(med.reminder_times or [])
        med_summaries.append({
            "name": med.med_name,
            "dosage": med.dosage,
            "schedule": med.recurrence,
            "reminder_times": med.reminder_times or [],
            "doses_taken_in_range": taken,
            "doses_scheduled_per_day": per_day,
            "pills_left": float(med.pill_qty) if med.pill_qty is not None else None,
            "pills_per_dose": float(med.pills_per_dose),
            "refill_reminder_at": med.refill_reminder,
        })

    symptoms = db.query(SymptomLog).filter(
        SymptomLog.user_id == user.id, SymptomLog.date >= since
    ).order_by(SymptomLog.date.desc()).all()

    return {
        "today": date.today().isoformat(),
        "range_days": days,
        "medications": med_summaries,
        "symptoms_in_range": [
            {
                "symptom": s.symptom,
                "date": s.date.isoformat(),
                "time": s.time.strftime("%H:%M"),
                "severity": s.severity,
                "duration": s.duration,
                "notes": s.notes,
            }
            for s in symptoms
        ],
    }


# POST /api/insights/ -> asks Gemini for insights on the signed-in user's own data
@router.post("/")
def get_insights(days: int = Query(7, ge=1, le=90), db: Session = Depends(get_db), curr_user: App_User = Depends(get_curr_user)):
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=503, detail="AI insights aren't set up yet. Add GEMINI_API_KEY to the backend .env.")

    summary = build_summary(db, curr_user, days)

    if not summary["medications"] and not summary["symptoms_in_range"]:
        return {"insights": [], "empty": True}

    try:
        response = httpx.post(
            GEMINI_URL.format(model=settings.GEMINI_MODEL),
            headers={"x-goog-api-key": settings.GEMINI_API_KEY, "content-type": "application/json"},
            json={
                "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
                "contents": [{"role": "user", "parts": [{"text": json.dumps(summary)}]}],
                "generationConfig": {"responseMimeType": "application/json", "maxOutputTokens": 1024},
            },
            timeout=45,
        )
        response.raise_for_status()
        text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        # Tolerate the model wrapping the JSON in a code fence.
        text = text[text.index("{"): text.rindex("}") + 1]
        insights = json.loads(text)["insights"]
    except (httpx.HTTPError, KeyError, ValueError, IndexError):
        raise HTTPException(status_code=502, detail="Couldn't generate insights right now. Please try again.")

    return {"insights": insights, "empty": False}
