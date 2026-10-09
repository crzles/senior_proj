#url routers example - not complete
from datetime import datetime, timedelta, timezone
import jwt
from fastapi import APIRouter, HTTPException, Depends, status
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
#SECURITY: https://fastapi.tiangolo.com/tutorial/security/

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

pwd_context = PasswordHash.recommended()

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def create_token(data: dict): #storing data in token {"sub": "testuser"}, meaning "who this token belongs to"
    to_encode = data.copy()
    exp_time = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES) #expiration time of 30min from now
    to_encode.update({"exp": exp_time}) # when decoding token it checks it and rejects if expired
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)

#STATUS CODES: https://fastapi.tiangolo.com/reference/status/

def get_curr_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials.", headers={"WWW-Authenticate": "Bearer"},)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload("sub")
        if email is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception

    curr_user = db.query(App_User).filter(App_User.email == email).first()
    if curr_user is None:
        raise credentials_exception
    return curr_user
        

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(App_User).filter(App_User.email == user.email).first() #search for email in db
    if existing_user: #if email exist
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.") #returns http 400 error

    new_user = App_User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=pwd_context.hash(user.password), #will hash user.password
        dob=user.dob,
        terms=user.terms_accepted
    )
    db.add(new_user) #adds new user to app_user db
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db:Session = Depends(get_db)):
    existing_user = db.query(App_User).filter(App_User.email == form_data.username).first()

    if not existing_user or not pwd_context.verify(form_data.password, existing_user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password.", headers={"WWW-Authenticate": "Bearer"},)
    access_token = create_token(data={"sub": existing_user.email})
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
def read_curr_user(curr_user: App_User = Depends(get_curr_user)):
    return curr_user