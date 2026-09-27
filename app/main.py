from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi import FastAPI
from app.database import engine, Base
from app.routers import auth
#to request/load html vvvvv
from fastapi import Request
from fastapi.templating import Jinja2Templates


#for db table to be created inside postgres
Base.metadata.create_all(bind=engine)

app = FastAPI()

#static directory
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

#example - loads frontend html templates
templates = Jinja2Templates(directory="templates")

#an endpoint
@app.get("/")
async def root():
    return {"message": "Hello, world!"}

#example - endpoint
@app.get("/login", response_class=HTMLResponse)
async def login_page():
    with open("frontend/login.html") as f:
        return f.read()

#example of laoding html request
@app.get("/settings", response_class=HTMLResponse)
async def settings_page(request:Request):
    return templates.TemplateResponse(request=request, name="settings.html")

#routers
app.include_router(auth.router)