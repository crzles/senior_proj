# just here for the sake of the skeleton!
from app.database import Base
#example of db att types
from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, text

#example - not complete
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String(255), nullable=False)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))