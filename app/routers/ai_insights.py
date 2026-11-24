from fastapi import APIRouter, Depends, HTTPException
from app.routers.auth import get_curr_user

from app.schemas.ai_insights import (
    AIHealthSummaryResponse,
    PharmacistQuestionsResponse
)

from app.services.gemini_service import (
    generate_health_insight,
    generate_pharmacist_questions,
    AIServiceError
)


router = APIRouter(
    prefix="/ai-insights",
    tags=["AI Health Insights"]
)


# Temporary fictional data for development and testing
MOCK_HEALTH_DATA = {
    "days": 7,
    "scheduled_doses": 14,
    "taken_doses": 11,
    "unlogged_doses": 3,
    "symptoms": {
        "Headache": 3,
        "Fatigue": 2
    }
}


# Generate AI health summary
@router.get(
    "/summary",
    response_model=AIHealthSummaryResponse
)
def get_ai_summary(
    current_user=Depends(get_curr_user)
):
    try:
        summary = generate_health_insight(MOCK_HEALTH_DATA)

        return AIHealthSummaryResponse(summary=summary)

    except AIServiceError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error)
        ) from error


# Generate pharmacist questions
@router.get(
    "/pharmacist-questions",
    response_model=PharmacistQuestionsResponse
)
def get_pharmacist_questions(
    current_user=Depends(get_curr_user)
):
    try:
        questions = generate_pharmacist_questions(
            MOCK_HEALTH_DATA
        )

        return PharmacistQuestionsResponse(
            questions=questions
        )

    except AIServiceError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error)
        ) from error