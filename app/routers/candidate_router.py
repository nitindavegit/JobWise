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
    
         # Check if candidate profile already exists
    existing_profile = db.query(candidate_models.Candidate).filter(candidate_models.Candidate.user_id == current_user.user_id).first()
    if existing_profile:
        # Update existing profile
        for key, value in profile.model_dump(exclude_unset=True).items():
            setattr(existing_profile, key, value)
        db.commit()
        db.refresh(existing_profile)
        result_profile = existing_profile
    else:
        # create new profile
        new_profile = candidate_models.Candidate(**profile.model_dump())
        new_profile.user_id = current_user.user_id
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)
        result_profile = new_profile
        # Update profile_completed in User table
        current_user.profile_completed = True
        db.commit()
    return {
        "user_type": current_user.user_type,
        "candidate_id": result_profile.candidate_id,
        "user_name": current_user.user_name,
        "user_email": current_user.user_email,
        "resume_text": result_profile.resume_text
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
        "resume_text": profile.resume_text
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
    existing_profile = db.query(candidate_models.Candidate).filter(candidate_models.Candidate.user_id == current_user.user_id).first()
    
    if existing_profile:
        existing_profile.resume_text = text
        db.commit()
        db.refresh(existing_profile)
    else:
        # Create new profile if it doesn't exist
        new_profile = candidate_models.Candidate(user_id=current_user.user_id, resume_text=text)
        db.add(new_profile)
        db.commit()
        
        # Mark profile as completed
        current_user.profile_completed = True
        db.commit()
    
    return {"message": "Resume uploaded and processed successfully", "extracted_text_preview": text[:200] + "..."}

# Recommend Jobs
@router.get("/recommend-jobs")
async def recommend_jobs(limit: int = 10, db: Session = Depends(get_db), current_user: user_models.User = Depends(oauth2.get_current_user)):
    from app import utils # import here to avoid circular dependency if any, or just convenience
    
    if current_user.user_type != "candidate":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only candidates can get recommendations.")
        
    candidate_profile = db.query(candidate_models.Candidate).filter(candidate_models.Candidate.user_id == current_user.user_id).first()
    if not candidate_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate profile not found. Please upload a resume first.")

    recommendations = utils.match_candidate_to_job(candidate_profile.candidate_id, db, limit=limit)
    return recommendations