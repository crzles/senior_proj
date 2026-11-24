from pydantic import BaseModel, Field


# AI health summary response
class AIHealthSummaryResponse(BaseModel):
    summary: str


# Pharmacist questions response
class PharmacistQuestionsResponse(BaseModel):
    questions: list[str] = Field(min_length=3, max_length=3)