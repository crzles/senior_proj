from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import FastAPI, HTTPException
from app.database import engine, Base
from app.routers import auth, drug_label


#for db table to be created inside postgres
Base.metadata.create_all(bind=engine)

app = FastAPI()


#an endpoint
@app.get("/api/hw")
async def root():
    return {"message": "Hello, world!"}

#routers
app.include_router(auth.router)
app.include_router(drug_label.router)

ROOT_DIR = Path(__file__).resolve().parent.parent  # senior_proj/
DIST_DIR = ROOT_DIR / "frontend" / "react" / "dist"

if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def load_react(full_path: str):
        if full_path.startswith("api/"): #prevents typos to load
            raise HTTPException(status_code=404, detail="Not found")
        file = (DIST_DIR / full_path).resolve()
        if file.is_file() and DIST_DIR in file.parents:
            return FileResponse(file)
        return FileResponse(DIST_DIR / "index.html")