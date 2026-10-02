# just here for the sake of the skeleton!
from pydantic import BaseModel, ConfigDict
#used for optional attributes vvvv
from typing import Optional
from datetime import datetime

#example - not complete
class UserCreate(BaseModel): #inherits BaseModel from Pydantic
    first_name: str
    last_name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

#token-based login; download dependecies
class Token(BaseModel):
    access_token: str
    token_type: str