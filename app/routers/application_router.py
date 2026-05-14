from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

from .. import oauth2
from app.db.models import user as user_models
from app.db.models import candidate as candidate_models
from app.db.models import employer as employer_models
from app.db.models import job as job_models
from app.db.models import application as app_models
from app.db.database import get_db
from app import schemas

router = APIRouter(
    prefix="/application",
    tags=['Application']
)


# Candidate applies to a job
@router.post("/apply/{job_id}", status_code=status.HTTP_201_CREATED, response_model=schemas.ApplicationResponse)
async def apply_to_job(job_id: int, db: Session = Depends(get_db), current_user: user_models.User = Depends(oauth2.get_current_user)):
    if current_user.user_type != "candidate":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only candidates can apply to jobs")
    
    # Get candidate record
    candidate = db.query(candidate_models.Candidate).filter(
        candidate_models.Candidate.user_id == current_user.user_id
    ).first()
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate profile not found")
    
    # Check job exists and is open
    job = db.query(job_models.Job).filter(job_models.Job.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if job.job_status != "open":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This job is not currently accepting applications")
    
    # Create application (unique constraint prevents duplicates)
    new_application = app_models.Application(
        candidate_id=candidate.candidate_id,
        job_id=job_id,
    )
    try:
        db.add(new_application)
        db.commit()
        db.refresh(new_application)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You have already applied to this job")
    
    return new_application


# Candidate views their applications (with job details)
@router.get("/my-applications", response_model=List[schemas.ApplicationWithJobResponse])
async def get_my_applications(db: Session = Depends(get_db), current_user: user_models.User = Depends(oauth2.get_current_user)):
    if current_user.user_type != "candidate":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only candidates can view their applications")
    
    candidate = db.query(candidate_models.Candidate).filter(
        candidate_models.Candidate.user_id == current_user.user_id
    ).first()
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate profile not found")
    
    applications = db.query(app_models.Application).filter(
        app_models.Application.candidate_id == candidate.candidate_id
    ).order_by(app_models.Application.applied_at.desc()).all()
    
    # Enrich with job title and company name
    result = []
    for app in applications:
        job = db.query(job_models.Job).filter(job_models.Job.job_id == app.job_id).first()
        employer = db.query(employer_models.Employer).filter(
            employer_models.Employer.employer_id == job.company_id
        ).first() if job else None
        
        app_data = schemas.ApplicationWithJobResponse.model_validate(app)
        app_data.job_title = job.job_title if job else None
        app_data.company_name = employer.company_name if employer else None
        result.append(app_data)
    
    return result


# Employer views applicants for a specific job
@router.get("/job/{job_id}/applicants", response_model=List[schemas.ApplicationWithCandidateResponse])
async def get_job_applicants(job_id: int, db: Session = Depends(get_db), current_user: user_models.User = Depends(oauth2.get_current_user)):
    if current_user.user_type != "employer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employers can view applicants")
    
    # Verify the job belongs to this employer
    employer = db.query(employer_models.Employer).filter(
        employer_models.Employer.user_id == current_user.user_id
    ).first()
    if not employer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employer profile not found")
    
    job = db.query(job_models.Job).filter(
        job_models.Job.job_id == job_id,
        job_models.Job.company_id == employer.employer_id
    ).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found or does not belong to you")
    
    applications = db.query(app_models.Application).filter(
        app_models.Application.job_id == job_id
    ).order_by(app_models.Application.applied_at.desc()).all()
    
    # Enrich with candidate name and email
    result = []
    for app in applications:
        candidate = db.query(candidate_models.Candidate).filter(
            candidate_models.Candidate.candidate_id == app.candidate_id
        ).first()
        user = db.query(user_models.User).filter(
            user_models.User.user_id == candidate.user_id
        ).first() if candidate else None
        
        app_data = schemas.ApplicationWithCandidateResponse.model_validate(app)
        app_data.candidate_name = user.user_name if user else None
        app_data.candidate_email = user.user_email if user else None
        result.append(app_data)
    
    return result


# Employer updates application status (accept/reject)
@router.patch("/{application_id}/status", response_model=schemas.ApplicationResponse)
async def update_application_status(
    application_id: int,
    status_data: schemas.ApplicationStatusChange,
    db: Session = Depends(get_db),
    current_user: user_models.User = Depends(oauth2.get_current_user)
):
    if current_user.user_type != "employer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employers can update application status")
    
    # Get the application
    application = db.query(app_models.Application).filter(
        app_models.Application.application_id == application_id
    ).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    
    # Verify the job belongs to this employer
    employer = db.query(employer_models.Employer).filter(
        employer_models.Employer.user_id == current_user.user_id
    ).first()
    job = db.query(job_models.Job).filter(
        job_models.Job.job_id == application.job_id,
        job_models.Job.company_id == employer.employer_id
    ).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only update applications for your own jobs")
    
    application.status = status_data.status
    db.commit()
    db.refresh(application)
    return application


# Candidate withdraws their application
@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
async def withdraw_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: user_models.User = Depends(oauth2.get_current_user)
):
    if current_user.user_type != "candidate":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only candidates can withdraw applications")
    
    candidate = db.query(candidate_models.Candidate).filter(
        candidate_models.Candidate.user_id == current_user.user_id
    ).first()
    
    application = db.query(app_models.Application).filter(
        app_models.Application.application_id == application_id,
        app_models.Application.candidate_id == candidate.candidate_id
    ).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    
    db.delete(application)
    db.commit()
