from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base

""" This model creates the "users" table in MySQL Users will log in using email and password """

class User(Base):
    # __tablename__ tells SQLAlchemy what to name the table in MySQL
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    
    # NEVER store plain passwords — always store the hashed version
    hashed_password = Column(String(255), nullable=False)
    

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())