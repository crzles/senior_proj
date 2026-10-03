# based on medication table in ER diagram
from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, Time, text, Boolean, Numeric, Date, ForeignKey, CheckConstraint, UniqueConstraint
from app.database import Base

class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True)
    # ForeignKey references are based on the relationships in the ER diagram 
    user_id = Column(Integer, ForeignKey("app_user.id", ondelete="CASCADE"), nullable=False)
    # nullable allows medication to be added without openFDA data for now
    label_set_id = Column(String(64), ForeignKey("drug_label.set_id", ondelete="SET NULL"), nullable=True)
    med_name = Column(Text, nullable=False)
    # Pre-filled fields are temporarily nullable until openFDA integration is implemented
    # Values can also be updated by the user
    med_type = Column(Text, nullable=True)
    dosage = Column(String(50), nullable=False)
    # pre-filled from openFDA when available, but can be updated by user
    route = Column(String(50), nullable=True)
    # pre-filled from openFDA when available, but can be updated by user
    is_otc = Column(Boolean, nullable=True)
    pills_per_dose = Column(Numeric(3, 2), server_default=text("1"), nullable=False)
    recurrence = Column(String(50), nullable=False)
    start_date = Column(Date, server_default=text("CURRENT_DATE"), nullable=False)
    # nullable because medication may not have an end date
    end_date = Column(Date, nullable=True)
    is_refillable = Column(Boolean, server_default=text("false"), nullable=False)
    refill_reminder = Column(Integer, nullable=True)
    # pre-filled from openFDA when available, but can be updated by user
    pill_qty = Column(Numeric(3, 2), nullable=True)
    # pre-filled from openFDA when available, but can be updated by user
    requirements = Column(Text, nullable=True)
    # pre-filled from openFDA when available, but can be updated by user
    avoid_notes = Column(Text, nullable=True)
    storage_notes = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)


#used on quickview
#constraints: https://medium.com/@ezekieloluwadamy/dive-deeper-into-sqlalchemy-core-mastering-keys-constraints-and-relationships-in-sqlalchemy-ca71a6127d74

class Refill(Base):
    __tablename__ = "refills"

    id = Column(Integer, primary_key=True)
    med_id = Column(Integer, ForeignKey("medications.id", ondelete="CASCADE"), nullable=False)
    refilled_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)
    qty_added = Column(Numeric(3, 2), nullable=False)
    dosage = Column(String(50), nullable=True)
    pharmacy_name = Column(Text, nullable=True)
    pharmacy_address = Column(Text, nullable=True)

    __table_args__ = (CheckConstraint("qty_added > 0", name="check_refills_qty_added"),)

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True)
    med_id = Column(Integer, ForeignKey("medications.id", ondelete="CASCADE"), nullable=False)
    dose_time = Column(Time, nullable=False)
    is_active = Column(Boolean, nullable=False, server_default=text("true"))

    #cant have the same reminder time twice per medication
    __table_args__ = (UniqueConstraint("med_id", "dose_time", name="unique_reminders_med_time"),)

class DoseLog(Base):
    __tablename__ = "dose_logs"

    id = Column(Integer, primary_key=True)
    reminder_id = Column(Integer, ForeignKey("reminders.id", ondelete="CASCADE"), nullable=False)
    scheduled_for = Column(TIMESTAMP(timezone=True), nullable=False)
    status = Column(String(10),  server_default="pending", nullable=False)
    remind_count = Column(Integer, server_default=text("0"), nullable=False)
    taken_at = Column(TIMESTAMP(timezone=True), nullable=True)

    __table_args__ = (
        CheckConstraint("status IN ('pending', 'taken', 'skipped', 'missed')", name="check_dose_logs_status"),
        CheckConstraint("remind_count BETWEEN 0 AND 4", name="check_dose_logs_remind_count"),
        #a single reminder cant create the same day's dose at 8am twice
        UniqueConstraint("reminder_id", "scheduled_for", name="unique_dose_logs_reminder_time")
    )