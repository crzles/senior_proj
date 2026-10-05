from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, text
from app.database import Base

class DrugLabel(Base):
    __tablename__ = "drug_label"

    id = Column(Integer, primary_key=True)
    set_id = Column(String(64), unique=True, nullable=False)
    med_name = Column(Text, nullable=False)
    generic_name = Column(Text, nullable=True)
    purpose = Column(Text, nullable=True)
    indications = Column(Text, nullable=True)
    dosage = Column(Text, nullable=True)
    storage = Column(Text, nullable=True)
    warnings = Column(Text, nullable=True)
    boxed_warning = Column(Text, nullable=True)
    last_updated = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text('now()'),
        nullable=False
    )