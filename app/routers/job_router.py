from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from .. import oauth2
from app.db.models import user as user_models
from app.db.models import employer as employer_models
from app.db.models import job as job_models
from app.db.database import get_db
from app import schemas
from typing import List


router = APIRouter(
    prefix="/job",
    tags = ['Job']
)


# Create a Job

@router.post("/create-job", status_code=status.HTTP_201_CREATED, response_model=schemas.JobResponse)
async def create_job(job: schemas.JobCreate, db: Session = Depends(get_db), current_user: user_models.User = Depends(oauth2.get_current_user)):
    if current_user.user_type != "employer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employers can create jobs.")

    # Get employer_id
    employer = db.query(employer_models.Employer).filter(employer_models.Employer.user_id == current_user.user_id).first()
    if not employer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employer not found")
    
    new_job = job_models.Job(**job.model_dump(), company_id=employer.employer_id,job_status = schemas.JobStatusEnum.open)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

# Reading all the jobs given by an employer
@router.get("/my-jobs", response_model=List[schemas.JobResponse])
async def get_my_jobs(db: Session = Depends(get_db), current_user: user_models.User = Depends(oauth2.get_current_user)):
    if current_user.user_type != "employer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employers can see their jobs.")
    # Get employer_id
    employer = db.query(employer_models.Employer).filter(employer_models.Employer.user_id == current_user.user_id).first()
    if not employer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employer not found")

    jobs = db.query(job_models.Job).filter(job_models.Job.company_id == employer.employer_id).all()
    return jobs 

# job status updates
@router.patch("/update-job-status/{job_id}", status_code=status.HTTP_200_OK, response_model=schemas.JobResponse)
async def update_job_status(job_id: int, status_data: schemas.JobStatusChange, db: Session = Depends(get_db), current_user: user_models.User = Depends(oauth2.get_current_user)):
    if current_user.user_type != "employer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employers can update job status.")
    # Get employer object
    employer = db.query(employer_models.Employer).filter(employer_models.Employer.user_id == current_user.user_id).first()
    if not employer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employer not found")
    # Get Job 
    job_query = db.query(job_models.Job).filter(job_models.Job.job_id == job_id,job_models.Job.company_id == employer.employer_id).first()
    if not job_query:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    
    # update Status
    job_query.job_status = status_data.job_status
    db.commit()
    db.refresh(job_query)
    return job_query

# Get a single job by ID
@router.get("/{job_id}", response_model=schemas.JobDetailResponse)
async def get_job_by_id(job_id: int, db: Session = Depends(get_db)):
    job = db.query(job_models.Job).filter(job_models.Job.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    
    # Get company name from employer
    employer = db.query(employer_models.Employer).filter(
        employer_models.Employer.employer_id == job.company_id
    ).first()
    
    # Build response with company_name
    job_data = schemas.JobDetailResponse.model_validate(job)
    job_data.company_name = employer.company_name if employer else None
    return job_data