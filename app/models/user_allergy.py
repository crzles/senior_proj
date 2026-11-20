from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, text
from app.database import Base


class UserAllergy(Base):
    __tablename__ = "user_allergy"

    allergy_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("app_user.id", ondelete="CASCADE"), nullable=False)
    name = Column(Text, nullable=False)
    reaction = Column(Text, nullable=False)
    severity = Column(String(20), nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"), nullable=False)
