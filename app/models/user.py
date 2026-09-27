# just here for the sake of the skeleton!
#example of db att types
from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, text
from app.database import Base

#example - not complete
class App_User(Base):
    __tablename__ = "app_user"

    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String(255), nullable=False)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))