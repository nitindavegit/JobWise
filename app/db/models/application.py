from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.database import Base
from sqlalchemy.sql import func
import enum

class ApplicationStatus(str, enum.Enum):
    applied = "applied"
    reviewing = "reviewing"
    accepted = "accepted"
    rejected = "rejected"

class Application(Base):
    __tablename__ = 'applications'
    
    application_id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey('candidates.candidate_id'), nullable=False)
    job_id = Column(Integer, ForeignKey('jobs.job_id'), nullable=False)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.applied, nullable=False)
    applied_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Prevent duplicate applications
    __table_args__ = (
        UniqueConstraint('candidate_id', 'job_id', name='uq_candidate_job'),
    )
    
    # Relationships
    candidate = relationship("Candidate", backref="applications")
    job = relationship("Job", backref="applications")
