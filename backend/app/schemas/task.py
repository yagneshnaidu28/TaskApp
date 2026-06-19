
# Schemas for creating, updating, and returning tasks

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# Data required to CREATE a new task
class TaskCreate(BaseModel):
    title: str
    body: Optional[str] = None


# Data allowed when UPDATING a task
# All fields are Optional — you don't have to update everything at once
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None


# What we RETURN for a task
class TaskResponse(BaseModel):
    id: int
    title: str
    body: Optional[str] = None
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}