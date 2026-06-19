# app/core/dependencies.py
# This file has ONE job: check "is this request from a logged-in user?"
# FastAPI routes use this as a dependency to protect themselves

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import decode_access_token
from app.crud.user import get_user_by_email
from app.models.user import User

# This tells FastAPI: "tokens come from the /auth/login endpoint"
# When a route has this dependency, Swagger UI shows an Authorize button
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),   # Extract token from Authorization header
    db: Session = Depends(get_db)          # Get DB session
) -> User:
    """
    This function runs BEFORE any protected route's logic.
    1. Extracts the JWT token from the request header
    2. Decodes it to get the email
    3. Looks up the user in the DB
    4. Returns the user — the route then receives them as a parameter
    
    If anything fails → raises 401 Unauthorized
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # decode_access_token returns email or None
    email = decode_access_token(token)
    
    if email is None:
        raise credentials_exception
    
    user = get_user_by_email(db, email)
    
    if user is None:
        raise credentials_exception
    
    return user  # ← this user object is injected into the route