from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load variables from .env file
load_dotenv()

DATABASE_URL = (
    f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# SessionLocal is a factory — every time you call SessionLocal() you get a new DB session


# Base is the parent class all your models will inherit from
# SQLAlchemy uses this to know which classes are database tables
Base = declarative_base()



# This is a "dependency" — FastAPI will call this function automatically to give each route its own database session, then close it when done
def get_db():
    db = SessionLocal()
    try:
        yield db        # give the session to the route
    finally:
        db.close()      # always close, even if an error happens