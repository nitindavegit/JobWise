from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from .. import oauth2
from app.db.models import user as user_models
from app.db.models import employer as employer_models
from app.db.database import get_db
from app import schemas


router = APIRouter(
    prefix="/employer",
    tags = ['Employer']
)

# update Employer's profile
@router.patch("/update-profile",status_code=status.HTTP_201_CREATED,response_model=schemas.EmployerProfileResponse)
async def update_employer_profile(profile : schemas.EmployerProfileChange, db: Session = Depends(get_db), current_user: user_models.User = Depends(oauth2.get_current_user)):
    if current_user.user_type != "employer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employers can update this profile.")
      # Check if employer profile already exists
    existing_profile = db.query(employer_models.Employer).filter(employer_models.Employer.user_id == current_user.user_id).first()
    if existing_profile:
        # Update existing profile
        for key, value in profile.model_dump(exclude_unset=True).items():
            setattr(existing_profile, key, value)
        db.commit()
        db.refresh(existing_profile)
        result_profile = existing_profile
    
    else :
        # Create new profile
        new_profile = employer_models.Employer(**profile.model_dump())
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
        "user_name": current_user.user_name,
        "user_email": current_user.user_email,
        "company_name": result_profile.company_name,
        "company_description": result_profile.company_description
    }
    


#  get Employer's profile
@router.get("/my-profile",response_model=schemas.EmployerProfileResponse)
async def get_employer_profile(db: Session = Depends(get_db), current_user: user_models.User = Depends(oauth2.get_current_user)):
    if current_user.user_type != "employer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employers can see this profile.")
    profile = db.query(employer_models.Employer).filter(employer_models.Employer.user_id == current_user.user_id).first()
    if profile == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Profile not found")
    return {
        "user_type": current_user.user_type,
        "user_name": current_user.user_name,
        "user_email": current_user.user_email,
        "company_name": profile.company_name,
        "company_description": profile.company_description
    }
    
    
    