#connecting postgresql
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.config import Settings

settings = Settings()
# #database setup, communicates with the postgresql database
engine = create_engine(settings.DATABASE_URL)

# #prevents autoloading to the data and reloading everytime it loads to the data
# #stores the objects in memory and keeps track of any changes needed in the data
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#base class model
Base = declarative_base()

def get_db():
    db = SessionLocal() #creates a db sesh using sessionlocal
    try:
        yield db #sets up context manager
    finally: #after execution,
        db.close() #the finally block makes sure sesh is closed