from sqlalchemy import Column, Integer, String,Text,Enum,ForeignKey,DateTime,JSON
from app.db.database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from...schemas import JobStatusEnum

class Job(Base):
    __tablename__ = 'jobs'
    company_id = Column(Integer,ForeignKey('employers.employer_id'),nullable=False)  # Link to Employer
    job_id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String(255),nullable=False)
    job_description = Column(Text,nullable=False)
    job_location = Column(String(100),nullable=False)
    skills_required = Column(JSON,nullable=False)
    salary_range = Column(String,nullable=False)
    
    created_at = Column(DateTime(timezone=True),server_default=func.now(),default=func.now(),nullable=False)
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),default=func.now(),onupdate=func.now(),nullable=False)
    
    employer = relationship("Employer",back_populates="jobs")
    job_status = Column(Enum(JobStatusEnum),default=JobStatusEnum.open)
    job_type = Column(String,nullable=False)