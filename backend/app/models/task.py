from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

""" This model creates the "tasks" table in MySQL Each task belongs to a user(via user_id foreign key) """

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=True)
    
    # Foreign key — links this task to the user who created it
    # If the user is deleted, their tasks are also deleted (CASCADE)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # This lets you do task.owner to get the User object
    owner = relationship("User", backref="tasks")