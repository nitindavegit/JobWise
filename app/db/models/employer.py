from sqlalchemy import Column, Integer, String,Text,DateTime,Enum,ForeignKey
from ..database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .user import User
from .job import Job

class Employer(Base):
    __tablename__ = 'employers'
    employer_id = Column(Integer,primary_key=True,index=True)
    user_id = Column(Integer,ForeignKey('users.user_id'),nullable=False)    # Link to User
    company_name = Column(String,nullable=True)
    company_description = Column(Text,nullable=True)
    
    
      # Relationship back to User
    user = relationship("User",back_populates="employer")
    
     # Relationship to Jobs posted by the Employer
    jobs = relationship("Job",back_populates="employer")