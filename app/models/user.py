from sqlalchemy import Column, Integer, String, TIMESTAMP, text, Date, Boolean, Text, ForeignKey
from app.database import Base


class App_User(Base):
    __tablename__ = "app_user"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    d_o_b = Column(Date, nullable=False)
    terms_accepted_at = Column(TIMESTAMP(timezone=True), nullable=False)
    terms_version = Column(String, server_default="v1", nullable=False)
    dark_mode = Column(Boolean, server_default=text("false"), nullable=False)
    failed_reset_attempts = Column(Integer, server_default=text("0"), nullable=False)
    reset_locked_until = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)


class SecurityQuestion(Base):
    __tablename__ = "security_questions"

    id = Column(Integer, primary_key=True)
    question_text = Column(Text, unique=True, nullable=False)


class UserSecurityAnswer(Base):
    __tablename__ = "user_security_answers"

    id = Column(Integer, ForeignKey("app_user.id", ondelete="CASCADE"), primary_key=True)
    question_id = Column(Integer, ForeignKey("security_questions.id"), primary_key=True, nullable=False)
    answer_hash = Column(Text, nullable=False)
