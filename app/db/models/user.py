from sqlalchemy import Column, Integer, String,Text,DateTime,Enum,Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base
from sqlalchemy.sql import func
from ...schemas import UserType

# Define a User model
# Which can be anyone either Candidate or Employer

class User(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String,nullable=False,unique=True)
    user_email = Column(String,nullable=False,unique=True)
    user_password = Column(String,nullable=False)
    user_type = Column(Enum(UserType,name = 'usertype'),nullable=False)
    created_at = Column(DateTime(timezone=True),server_default=func.now(),nullable=False)
    profile_completed = Column(Boolean,default=False)
    
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    profile_picture_url = Column(String, nullable=True)
    
    employer = relationship("Employer",back_populates="user")
    candidate = relationship("Candidate",back_populates="user")