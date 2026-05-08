from passlib.context import CryptContext

pwd_context = CryptContext(schemes= ["bcrypt"], deprecated = "auto")

def hash(password : str):
    return pwd_context.hash(password)

def verify (plain_password, hashed_password):
    return pwd_context.verify(plain_password,hashed_password)


from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import re
from typing import List
from app.db.models import job as job_models
from app.db.models import candidate as candidate_models
from app import schemas

def normalize_text(text: str) -> set:
    """Converts text to lowercase and splits into unique words."""
    if not text:
        return set()
    # Remove punctuation and split
    text = re.sub(r'[^\w\s]', '', text.lower())
    return set(text.split())

def calculate_match_score(resume_text: str, job_skills: List[str]) -> int:
    """
    Calculates a match score (0-100) based on skill overlap.
    """
    if not resume_text or not job_skills:
        return 0
    
    resume_words = normalize_text(resume_text)
    # Also check for multi-word skills in the raw lowercased text
    resume_text_lower = resume_text.lower()
    
    match_count = 0
    for skill in job_skills:
        skill_lower = skill.lower()
        # Check if skill exists in set of words OR as a substring (for multi-word skills like "machine learning")
        if skill_lower in resume_words or skill_lower in resume_text_lower:
            match_count += 1
            
    if len(job_skills) == 0:
        return 0
        
    return int((match_count / len(job_skills)) * 100)

def match_candidate_to_job(candidate_id: int, db: Session, limit: int = 10):
    # Fetch candidate's profile
    candidate = db.query(candidate_models.Candidate).filter(candidate_models.Candidate.candidate_id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    
    # Fetch all open jobs
    jobs = db.query(job_models.Job).filter(job_models.Job.job_status == schemas.JobStatusEnum.open).all()
    
    scored_jobs = []
    for job in jobs:
        score = calculate_match_score(candidate.resume_text, job.skills_required)
        if score > 0: # Only return jobs with at least some match
            # Extend JobResponse with score - strictly we should define a new schema for this
            # For now, we'll return a dict or similar
            job_data = schemas.JobResponse.model_validate(job).model_dump()
            job_data['match_score'] = score
            scored_jobs.append(job_data)
            
    # Sort by score desc
    scored_jobs.sort(key=lambda x: x['match_score'], reverse=True)
    
    return scored_jobs[:limit]
    
    