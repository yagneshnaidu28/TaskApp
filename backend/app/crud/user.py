""" All database operations related to users
Routes call these functions — routes don't touch the DB directly """

from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password, verify_password


def get_user_by_email(db: Session, email: str) -> User | None:
    """Find a user in the database by their email"""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Find a user by their ID"""
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user_data: UserCreate) -> User:
    """
    Create a new user:
    1. Hash the password (NEVER save plain text)
    2. Create User object
    3. Add to DB and commit
    """
    hashed = hash_password(user_data.password)
    
    new_user = User(
        email=user_data.email,
        hashed_password=hashed
    )
    
    db.add(new_user)      # stage the insert
    db.commit()           # actually write to MySQL
    db.refresh(new_user)  # reload from DB to get auto-generated fields like id
    
    return new_user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """
    Verify login credentials:
    1. Find user by email
    2. Check password matches the stored hash
    Returns the user if valid, None if not
    """
    user = get_user_by_email(db, email)
    
    if not user:
        return None
    
    if not verify_password(password, user.hashed_password):
        return None
    
    return user