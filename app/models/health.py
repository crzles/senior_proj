from sqlalchemy import Column, Integer, String, Date, Time, Text, TIMESTAMP, text, ForeignKey, CheckConstraint
from app.database import Base


# One entry from the Symptom log page
class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("app_user.id", ondelete="CASCADE"), nullable=False)
    symptom = Column(Text, nullable=False)                    # typed or picked, e.g. "Headache"
    date = Column(Date, nullable=False)                       # when the symptom happened
    time = Column(Time, nullable=False)
    severity = Column(String(10), nullable=False)             # Mild, Moderate or Severe
    duration = Column(Text, server_default="", nullable=False)
    notes = Column(Text, server_default="", nullable=False)
    logged_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)

    __table_args__ = (CheckConstraint("severity IN ('Mild', 'Moderate', 'Severe')", name="check_symptom_logs_severity"),)



#TODO: diary_entry, health_contact, appoinment tables go here too