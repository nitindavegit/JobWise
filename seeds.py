import sys
import os
from datetime import datetime, UTC
# Ensure app module can be found
sys.path.append(os.getcwd())

from app.db.database import SessionLocal
from app.db.models import user as user_models
from app.db.models import employer as employer_models
from app.db.models import candidate as candidate_models
from app.db.models import job as job_models
from app.utils import hash
from app import schemas

def seed():
    db = SessionLocal()
    
    try:
        print("Seeding/Updating data...")

        # 1. Employer
        employer_email = "recruiter@techcorp.com"
        employer = db.query(user_models.User).filter(user_models.User.user_email == employer_email).first()
        
        if not employer:
            employer = user_models.User(
                user_name="techcorp_recruiter",
                user_email=employer_email,
                user_password=hash("password123"),
                user_type="employer",
                profile_completed=True
            )
            db.add(employer)
            db.commit()
            db.refresh(employer)
            print("Created Employer User.")
        else:
            # Update password and username just in case
            employer.user_password = hash("password123")
            employer.user_name = "techcorp_recruiter"
            db.commit()
            print("Updated Employer Password and Username.")

        employer_profile = db.query(employer_models.Employer).filter(employer_models.Employer.user_id == employer.user_id).first()
        if not employer_profile:
            employer_profile = employer_models.Employer(
                user_id=employer.user_id,
                company_name="TechCorp",
                company_description="Leading tech company in AI."
            )
            db.add(employer_profile)
            db.commit()
            db.refresh(employer_profile)

        # 2. Candidate
        candidate_email = "john@example.com"
        candidate = db.query(user_models.User).filter(user_models.User.user_email == candidate_email).first()
        
        if not candidate:
            candidate = user_models.User(
                user_name="johndeveloper",
                user_email=candidate_email,
                user_password=hash("password123"),
                user_type="candidate",
                profile_completed=True
            )
            db.add(candidate)
            db.commit()
            db.refresh(candidate)
            print("Created Candidate User.")
        else:
            candidate.user_password = hash("password123")
            candidate.user_name = "johndeveloper"
            db.commit()
            print("Updated Candidate Password and Username.")

        candidate_profile = db.query(candidate_models.Candidate).filter(candidate_models.Candidate.user_id == candidate.user_id).first()
        if not candidate_profile:
            candidate_profile = candidate_models.Candidate(
                user_id=candidate.user_id,
                resume_text="Experienced Python Developer with 5 years in FastAPI and React. Skills: Python, FastAPI, React, SQL."
            )
            db.add(candidate_profile)
            db.commit()
        else:
            candidate_profile.resume_text = "Experienced Python Developer with 5 years in FastAPI and React. Skills: Python, FastAPI, React, SQL."
            db.commit()

        # 3. Create Jobs (Only if not exist to avoid duplicates)
        jobs_data = [
            {"title": "Senior Python Developer", "desc": "Looking for 5+ years exp in Python/Django/FastAPI.", "loc": "Remote", "skills": ["Python", "FastAPI", "PostgreSQL"], "salary": "$120k-150k"},
            {"title": "Frontend Engineer", "desc": "React.js expert needed.", "loc": "New York", "skills": ["React", "JavaScript", "CSS"], "salary": "$100k-130k"},
            {"title": "Full Stack Developer", "desc": "Python + React stack.", "loc": "San Francisco", "skills": ["Python", "React", "AWS"], "salary": "$130k-160k"},
            {"title": "Data Scientist", "desc": "ML and AI focus.", "loc": "Remote", "skills": ["Python", "TensorFlow", "Pandas"], "salary": "$140k-170k"},
            {"title": "DevOps Engineer", "desc": "CI/CD pipelines and cloud infra.", "loc": "Austin", "skills": ["Docker", "Kubernetes", "AWS"], "salary": "$110k-140k"},
        ]

        for j in jobs_data:
            existing_job = db.query(job_models.Job).filter(job_models.Job.job_title == j["title"], job_models.Job.company_id == employer_profile.employer_id).first()
            if not existing_job:
                job = job_models.Job(
                    company_id=employer_profile.employer_id,
                    job_title=j["title"],
                    job_description=j["desc"],
                    job_location=j["loc"],
                    skills_required=j["skills"],
                    salary_range=j["salary"],
                    job_type="Full-time",
                    job_status=schemas.JobStatusEnum.open,
                    created_at = datetime.now(UTC),
                    updated_at = datetime.now(UTC)
                )
                db.add(job)
        
        db.commit()
        print("Seeding complete! Ensured Employer, Candidate, and Jobs exist.")
    
    finally:
        db.close()

if __name__ == "__main__":
    seed()
