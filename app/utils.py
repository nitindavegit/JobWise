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
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def normalize_text(text: str) -> set:
    """Converts text to lowercase and splits into unique words."""
    if not text:
        return set()
    # Remove punctuation and split
    text = re.sub(r'[^\w\s]', '', text.lower())
    return set(text.split())

def calculate_match_score(candidate_text: str, job_skills: List[str]) -> int:
    """
    Calculates a match score (0-100) based on skill overlap.
    """
    if not candidate_text or not job_skills:
        return 0
    
    candidate_words = normalize_text(candidate_text)
    # Also check for multi-word skills in the raw lowercased text
    candidate_text_lower = candidate_text.lower()
    
    match_count = 0
    for skill in job_skills:
        skill_lower = skill.lower()
        # Check if skill exists in set of words OR as a substring (for multi-word skills like "machine learning")
        if skill_lower in candidate_words or skill_lower in candidate_text_lower:
            match_count += 1
            
    if len(job_skills) == 0:
        return 0
        
    return int((match_count / len(job_skills)) * 100)

def calculate_tfidf_match_score(candidate_text: str, job_description: str, job_skills: List[str]) -> int:
    """
    Calculates a match score using TF-IDF vectorization and cosine similarity.
    This is more sophisticated than simple word matching.
    """
    if not candidate_text or not job_description:
        return 0
    
    # Combine job description and skills for better matching
    job_text = job_description + " " + " ".join(job_skills)
    
    # create TF-IDF vectorizer
    vectorizer = TfidfVectorizer(stop_words='english')
    
    try:
        tfidf_matrix = vectorizer.fit_transform([candidate_text, job_text])
        similarity = cosine_similarity(tfidf_matrix[0:1] , tfidf_matrix[1: 2])[0][0]
        
        return int(similarity * 100)
    
    except Exception as e:
        # Fallback to simple matching if TF-IDF fails
        return calculate_match_score(candidate_text, job_skills)
    

def match_candidate_to_job(candidate_id: int, db: Session, limit: int = 10):
    # Fetch candidate's profile
    candidate = db.query(candidate_models.Candidate).filter(candidate_models.Candidate.candidate_id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    
    # Combine candidate's resume text and manually entered skills
    candidate_text_parts = []
    if candidate.resume_text:
        candidate_text_parts.append(candidate.resume_text)
    if candidate.skills:
        candidate_text_parts.append(" ".join(candidate.skills))
        
    candidate_combined_text = " ".join(candidate_text_parts).strip()
    
    # Fetch all open jobs
    jobs = db.query(job_models.Job).filter(job_models.Job.job_status == schemas.JobStatusEnum.open).all()
    
    scored_jobs = []
    for job in jobs:
        score = calculate_tfidf_match_score(candidate_combined_text, job.job_description, job.skills_required)
        if score > 0: # Only return jobs with at least some match
            job_data = schemas.JobResponse.model_validate(job).model_dump()
            job_data['match_score'] = score
            scored_jobs.append(job_data)
            
    # Sort by score desc
    scored_jobs.sort(key=lambda x: x['match_score'], reverse=True)
    
    return scored_jobs[:limit]
    
    