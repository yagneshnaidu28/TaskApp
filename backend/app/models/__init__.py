""" 
 Importing here ensures SQLAlchemy knows about all models
 when we call Base.metadata.create_all() """

from app.models.user import User
from app.models.task import Task