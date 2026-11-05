from fastapi import APIRouter, Depends
from app.models.user import App_User
from app.routers.auth import get_curr_user
from app.schemas.user import UserResponse

router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)

@router.get("/me", response_model=UserResponse)
def read_curr_user(curr_user: App_User = Depends(get_curr_user)):
    return curr_user


#future work
# PATCH /me (dark mode)
# PATCH /me/email
# DELETE /me