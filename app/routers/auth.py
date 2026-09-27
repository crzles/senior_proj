#url routers example - not complete
from datetime import datetime, timedelta, timezone
import jwt
from fastapi import APIRouter, FastAPI, HTTPException, Depends
from app.config import Settings
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash

#CRUD Ops / HTTP Requests
#Create - POST
#Read - GET
#Update - PUT
#Delete - DELETE

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

password_hash = PasswordHash.recommended()

settings = Settings()
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"


def create_token(data: dict): #storing data in token {"sub": "testuser"}, meaning "who this token belongs to"
    exp_time = datetime.now(timezone.utc) + timedelta(minutes=30) #expiration time of 30min from now
    data.update({"exp": exp_time}) #adds exp_time into exp(jwt std field), when decoding token it checks it and rejects if expired; {"sub": "testuser", "exp": datetime(2026, 5, 21, 4, 30, 00)}
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
