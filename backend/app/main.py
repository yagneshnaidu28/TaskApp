# app/main.py
# This is the entry point of your FastAPI application
# Think of it as the "headquarters" that connects everything

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
  
# Load .env before anything else
load_dotenv()

# Import database and models
from app.database import engine
import app.models  # This import triggers __init__.py which imports User and Task

# Import routers
from app.routers import auth, tasks

# Create all MySQL tables based on your models
# If tables already exist, this does nothing (safe to run multiple times)
from app.database import Base
Base.metadata.create_all(bind=engine)

# Create the FastAPI app instance
app = FastAPI(
    title=os.getenv("APP_NAME", "Task Manager API"),
    description="A Task Manager API with JWT Authentication",
    version="1.0.0",
    docs_url="/docs",      # Swagger UI at http://localhost:8000/docs
    redoc_url="/redoc"
)

# CORS Middleware — This is CRITICAL for Angular to talk to FastAPI
# Without this, the browser blocks Angular's requests (different ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],   # Angular dev server port
    allow_credentials=True,
    allow_methods=["*"],     # Allow GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],     # Allow Authorization header (needed for JWT)
)

# Register routers — this is how FastAPI knows about your routes
app.include_router(auth.router)
app.include_router(tasks.router)


# Health check route — useful to quickly verify API is running
@app.get("/", tags=["Health"])
def root():
    return {"message": "Task Manager API is running", "status": "healthy"}