""" Schemas define what data the API accepts and returns for users
They are NOT database models — they're just validation shapes """


from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# Data needed to REGISTER a new user
class UserCreate(BaseModel):
    email: EmailStr          # pydantic validates it's a real email format
    password: str


# Data needed to LOGIN
class UserLogin(BaseModel):
    email: EmailStr
    password: str

""" 
 What we RETURN when someone asks about a user
 Notice: no password field — we never return passwords! """
class UserResponse(BaseModel):
    id: int
    email: str
    created_at: Optional[datetime] = None

    # This tells Pydantic to read data from SQLAlchemy objects (not just dicts)
    model_config = {"from_attributes": True}


# The JWT token we return after successful login
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# What's stored INSIDE the token (the payload)
class TokenData(BaseModel):
        email: Optional[str] = None
