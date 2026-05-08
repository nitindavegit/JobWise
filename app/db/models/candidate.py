from sqlalchemy import Column, Integer, String,Text, DateTime,ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base
from sqlalchemy.sql import func
from .user import User
# Define the Candidate model
class Candidate(Base):
    __tablename__ = 'candidates'
    candidate_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey('users.user_id'),nullable=False)     # Link to User
    resume_text = Column(Text)
    
    user = relationship("User",back_populates="candidate")