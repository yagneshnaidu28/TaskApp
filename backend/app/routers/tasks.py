# app/routers/tasks.py
# ALL task routes are PROTECTED — login required
# Notice every route has: current_user: User = Depends(get_current_user)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.crud.task import (
    get_all_tasks_for_user,
    get_task_by_id,
    create_task,
    update_task,
    delete_task
)
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


@router.get("/", response_model=List[TaskResponse])
def list_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)   # ← PROTECTED
):
    """Get all tasks for the logged-in user — used to populate the dashboard"""
    tasks = get_all_tasks_for_user(db, current_user.id)
    return tasks


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_new_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new task — called when user submits the Add Task form"""
    new_task = create_task(db, task_data, current_user.id)
    return new_task


@router.get("/{task_id}", response_model=TaskResponse)
def get_single_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a single task by ID — used to pre-fill the Update form"""
    task = get_task_by_id(db, task_id, current_user.id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
    
    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_existing_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a task — called when user submits the Update form"""
    updated_task = update_task(db, task_id, task_data, current_user.id)
    
    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
    
    return updated_task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a task — called when user clicks the Delete button on a grid card"""
    deleted = delete_task(db, task_id, current_user.id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
    
    # 204 means "success, no content to return"
    return None