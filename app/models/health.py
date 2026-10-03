from sqlalchemy import Column, Integer, Date, Text, text, ForeignKey
from app.database import Base


class Symptom(Base):
    __tablename__ = "symptoms"

    id = Column(Integer, primary_key=True)
    name = Column(Text, unique=True, nullable=False)

class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("app_user.id", ondelete="CASCADE"), nullable=False)
    symptom_id = Column(Integer, ForeignKey("symptoms.id"), nullable=False)
    med_id = Column(Integer, ForeignKey("medications.id", ondelete="SET NULL"), nullable=True)
    logged_on = Column(Date, server_default=text("CURRENT_DATE"), nullable=False)
    note = Column(Text, nullable=True)



#TODO: diary_entry, health_contact, appoinment tables go here too