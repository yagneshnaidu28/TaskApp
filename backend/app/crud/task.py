# app/crud/task.py
# All database operations for tasks (Create, Read, Update, Delete)

from sqlalchemy.orm import Session
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate
from typing import List


def get_all_tasks_for_user(db: Session, user_id: int) -> List[Task]:
    """Get ALL tasks that belong to a specific user"""
    return db.query(Task).filter(Task.user_id == user_id).all()


def get_task_by_id(db: Session, task_id: int, user_id: int) -> Task | None:
    """
    Get a single task — but ONLY if it belongs to this user.
    This prevents User A from reading User B's tasks.
    """
    return db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == user_id
    ).first()


def create_task(db: Session, task_data: TaskCreate, user_id: int) -> Task:
    """Create a new task for the logged-in user"""
    new_task = Task(
        title=task_data.title,
        body=task_data.body,
        user_id=user_id
    )
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    
    return new_task


def update_task(db: Session, task_id: int, task_data: TaskUpdate, user_id: int) -> Task | None:
    """
    Update an existing task.
    Uses exclude_unset=True so only fields the user actually sent get updated.
    Example: if user only sends {"title": "new title"}, body stays unchanged.
    """
    task = get_task_by_id(db, task_id, user_id)
    
    if not task:
        return None
    
    # Convert Pydantic schema to dict, skip fields not sent by user
    update_data = task_data.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(task, field, value)   # task.title = "new title", etc.
    
    db.commit()
    db.refresh(task)
    
    return task


def delete_task(db: Session, task_id: int, user_id: int) -> bool:
    """
    Delete a task. Returns True if deleted, False if task not found.
    We check user_id so users can only delete THEIR OWN tasks.
    """
    task = get_task_by_id(db, task_id, user_id)
    
    if not task:
        return False
    
    db.delete(task)
    db.commit()
    
    return True