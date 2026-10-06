from pydantic import BaseModel, ConfigDict, Field, EmailStr
#from sqlmodel import Field, SQLModel
from datetime import datetime, date
from typing import Optional

#used for optional attributes vvvv
#from typing import Optional

#create/request model: defines only what a client needs to send
#response model: controls exactly what data gets sent back from client,
#protecting sensitive fields

class UserCreate(BaseModel): #inherits BaseModel from Pydantic
    first_name: str = Field(min_length=1, max_length=50)
    last_name: str = Field(min_length=1, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8)
    dob: date
    terms_accepted: bool

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    terms_version: str
    dark_mode: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

#token-based login; download dependecies
class Token(BaseModel):
    access_token: str
    token_type: str

class SecurityQuestionResponse(BaseModel):
    id: int
    question_text: str

    model_config = ConfigDict(from_attributes=True)

class UserSecurityAnswerCreate(BaseModel):
    questions_id: int
    answer: str = Field(min_length=1)

class UserSecurityAnswerResponse(BaseModel):
    questions_id: int

    model_config = ConfigDict(from_attributes=True)