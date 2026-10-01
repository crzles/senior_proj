# based on medication table in ER diagram 
from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, text, Boolean, Numeric, Date, ForeignKey
from app.database import Base

class Medication(Base):
    __tablename__ = "medication"
    med_id = Column(Integer, primary_key=True, nullable=False)

    # ForeignKey references are based on the relationships in the ER diagram 
    user_id = Column(Integer, ForeignKey("app_user.user_id"), nullable=False)

    # nullable allows medication to be added without openFDA data for now
    label_set_id = Column(String, ForeignKey("drug_label.set_id"), nullable=True)
    
    med_name = Column(Text, nullable=False)

    # Pre-filled fields are temporarily nullable until openFDA integration is implemented
    # Values can also be updated by the user
    med_type = Column(Text, nullable=True)

    dosage = Column(String, nullable=False)

    # pre-filled from openFDA when available, but can be updated by user
    route = Column(String, nullable=True)

    # pre-filled from openFDA when available, but can be updated by user
    is_otc = Column(Boolean, nullable=True)

    pills_per_dose = Column(Numeric, nullable=False)
    recurrence = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)

    # nullable because medication may not have an end date
    end_date = Column(Date, nullable=True)

    is_refillable = Column(Boolean, nullable=False)
    refill_reminder = Column(Integer, nullable=False)

    # pre-filled from openFDA when available, but can be updated by user
    pill_qty = Column(Numeric, nullable=True)

    # pre-filled from openFDA when available, but can be updated by user
    requirements = Column(Text, nullable=True)

    # pre-filled from openFDA when available, but can be updated by user
    avoid_notes = Column(Text, nullable=True)

    storage_notes = Column(Text, nullable=False)

    created_at = Column(
        TIMESTAMP(timezone=True), 
        server_default=text('now()'), 
        nullable=False
    )
