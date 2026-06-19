# app/routers/auth.py
# Handles: Register and Login
# These are PUBLIC routes — no token needed

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.schemas.user import UserCreate, UserResponse, Token, UserLogin
from app.crud.user import get_user_by_email, create_user, authenticate_user
from app.core.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(
    prefix="/auth",      # all routes here start with /auth
    tags=["Authentication"]   # groups them in Swagger UI
)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    - Check if email already exists
    - Hash password and save to DB
    - Return user info (no password)
    """
    # Check if email already taken
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    new_user = create_user(db, user_data)
    return new_user


@router.post("/login", response_model=Token)
def login(user_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login with email + password.
    Returns a JWT access token if credentials are valid.
    
    The frontend stores this token and sends it in every future request
    as: Authorization: Bearer <token>
    """
    user = authenticate_user(db, user_data.username, user_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create token with the user's email as the subject
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_me(db: Session = Depends(get_db)):
    """Placeholder — will be wired with auth dependency in next step"""
    pass