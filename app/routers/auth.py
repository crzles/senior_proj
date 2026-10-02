#url routers example - not complete
from datetime import datetime, timedelta, timezone
import jwt
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import App_User
#Token for log in
from app.schemas.user import UserCreate, UserResponse, Token

#APIRouter: https://fastapi.tiangolo.com/reference/apirouter/?h=post
#CRUD Ops / HTTP Requests
#Create - POST
#Read - GET
#Update - PUT
#Delete - DELETE

#HTTPException: https://fastapi.tiangolo.com/reference/exceptions/?h=httpex
#Depends: https://fastapi.tiangolo.com/reference/dependencies/?h=depends
#JWT: https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/?h=jwt.exceptions#about-jwt

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

pwd_context = PasswordHash.recommended()

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def create_token(data: dict): #storing data in token {"sub": "testuser"}, meaning "who this token belongs to"
    exp_time = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES) #expiration time of 30min from now
    data.update({"exp": exp_time}) # when decoding token it checks it and rejects if expired
    return jwt.encode(data, settings.SECRET_KEY, algorithm=ALGORITHM)

#example - not complete; inputs new user in db/generates data in db
@router.post("/signup", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(App_User).filter(App_User.email == user.email).first() #search for email in db
    if existing_user: #if email exist
        raise HTTPException(status_code=400, detail="Email already registered.") #returns http 400 error

    new_user = App_User( 
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=pwd_context.hash(user.password) #will hash user.password
    )
    db.add(new_user) #adds new user to app_user db
    db.commit()
    db.refresh(new_user)
    return new_user