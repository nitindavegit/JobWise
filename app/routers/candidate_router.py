from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from .. import oauth2
from app.db.models import user as user_models
from app.db.models import candidate as candidate_models
from app.db.database import get_db
from app import schemas

router = APIRouter(
    prefix="/candidate",
    tags = ['Candidate']
)

# edit candidate's profile
@router.patch("/update-profile",status_code=status.HTTP_201_CREATED,response_model=schemas.CandidateProfileResponse)
async def update_candidate_profile(profile : schemas.CandidateProfileChange, db: Session = Depends(get_db), current_user: user_models.User = Depends(oauth2.get_current_user)):
    if current_user.user_type != "candidate":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only candidates can access this resource.")
    
    profile_data = profile.model_dump(exclude_unset=True)
    
    # Extract user fields
    user_fields = ["first_name", "last_name", "profile_picture_url"]
    for field in user_fields:
        if field in profile_data:
            setattr(current_user, field, profile_data.pop(field))

         # Check if candidate profile already exists
    existing_profile = db.query(candidate_models.Candidate).filter(candidate_models.Candidate.user_id == current_user.user_id).first()
    if existing_profile:
        # Update existing profile
        for key, value in profile_data.items():
            setattr(existing_profile, key, value)
        db.commit()
        db.refresh(existing_profile)
        result_profile = existing_profile
    else:
        # create new profile
        new_profile = candidate_models.Candidate(**profile_data)
        new_profile.user_id = current_user.user_id
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)
        result_profile = new_profile
    
    # Always mark profile as completed after update
    current_user.profile_completed = True
    db.commit()
    
    return {
        "user_type": current_user.user_type,
        "candidate_id": result_profile.candidate_id,
        "user_name": current_user.user_name,
        "user_email": current_user.user_email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "profile_picture_url": current_user.profile_picture_url,
        "resume_text": result_profile.resume_text,
        "skills": result_profile.skills or []
    }
    


#  get candidate's profile
@router.get("/my-profile",response_model=schemas.CandidateProfileResponse)
async def get_candidate_profile(db: Session = Depends(get_db), current_user: user_models.User = Depends(oauth2.get_current_user)):
    if current_user.user_type != "candidate":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only candidates can access this resource.")
    
    profile = db.query(candidate_models.Candidate).filter(candidate_models.Candidate.user_id == current_user.user_id).first()
    if profile == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Profile not found")
    return {
        "user_type": current_user.user_type,
        "candidate_id": profile.candidate_id,
        "user_name": current_user.user_name,
        "user_email": current_user.user_email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "profile_picture_url": current_user.profile_picture_url,
        "resume_text": profile.resume_text,
        "skills": profile.skills or []
    }

# Upload Resume (PDF)
from fastapi import File, UploadFile
import io
from pypdf import PdfReader

@router.post("/upload-resume", status_code=status.HTTP_200_OK)
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: user_models.User = Depends(oauth2.get_current_user)):
    # Verify user is a candidate
    if current_user.user_type != "candidate":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only candidates can upload resumes.")

    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF files are allowed.")

    # Read and extract text
    try:
        contents = await file.read()
        pdf_reader = PdfReader(io.BytesIO(contents))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to process PDF: {str(e)}")

    # Save extracted text to profile
    # Extract skills from text
    COMMON_SKILLS = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'Swift',
        'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
        'HTML', 'CSS', 'Tailwind CSS', 'Sass', 'Bootstrap',
        'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Firebase',
        'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD',
        'Git', 'GitHub', 'GitLab', 'Jira', 'Figma', 'Adobe XD',
        'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision',
        'REST API', 'GraphQL', 'WebSockets', 'Microservices', 'System Design',
        'Agile', 'Scrum', 'Project Management', 'Leadership', 'Communication',
        'Data Analysis', 'Data Engineering', 'ETL', 'Power BI', 'Tableau', 'Excel',
        'iOS Development', 'Android Development', 'React Native', 'Flutter',
        'Cybersecurity', 'Penetration Testing', 'Linux', 'Networking',
        'Blockchain', 'Solidity', 'Web3', 'Smart Contracts',
        'UI/UX Design', 'Product Design', 'Wireframing', 'Prototyping'
    ]
    extracted_skills = []
    text_lower = text.lower()
    for skill in COMMON_SKILLS:
        # Check whole word match or simple inclusion for complex terms
        if skill.lower() in text_lower:
            extracted_skills.append(skill)
            
    existing_profile = db.query(candidate_models.Candidate).filter(candidate_models.Candidate.user_id == current_user.user_id).first()
    
    if existing_profile:
        existing_profile.resume_text = text
        # Merge extracted skills with existing ones
        current_skills = existing_profile.skills or []
        merged_skills = list(set(current_skills + extracted_skills))
        existing_profile.skills = merged_skills
        db.commit()
        db.refresh(existing_profile)
    else:
        # Create new profile if it doesn't exist
        new_profile = candidate_models.Candidate(user_id=current_user.user_id, resume_text=text, skills=extracted_skills)
        db.add(new_profile)
        db.commit()
        
        # Mark profile as completed
        current_user.profile_completed = True
        db.commit()
    
    return {"message": "Resume uploaded and processed successfully", "extracted_text_preview": text[:200] + "..."}

# Recommend Jobs
from typing import List

@router.get("/recommend-jobs", response_model=List[schemas.JobRecommendationResponse])
async def recommend_jobs(
    limit: int = 10,
    page: int = 1,
    db: Session = Depends(get_db),
    current_user: user_models.User = Depends(oauth2.get_current_user)
):
    from app import utils

    if current_user.user_type != "candidate":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only candidates can get recommendations.")

    candidate_profile = db.query(candidate_models.Candidate).filter(candidate_models.Candidate.user_id == current_user.user_id).first()
    if not candidate_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate profile not found. Please upload a resume first.")

    # Clamp page and limit to sane values
    limit = max(1, min(limit, 50))
    page = max(1, page)
    offset = (page - 1) * limit

    # Get all scored jobs then slice for the requested page
    all_recommendations = utils.match_candidate_to_job(candidate_profile.candidate_id, db, limit=500)
    return all_recommendations[offset: offset + limit]