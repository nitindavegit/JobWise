from pydantic import BaseModel, EmailStr,Field
from sqlalchemy import Text
from enum import Enum
from typing import Literal,List,Optional
from datetime import datetime

# basic enums that can be used in other schemas
class UserType(str,Enum):
    candidate = "candidate"
    employer = "employer"
    
class JobStatusEnum(str,Enum):
    open = "open"
    closed = "closed"
    paused = "paused"
    

# ========== User Schemas ==========

# shared Base
class UserBase(BaseModel):
    user_name : str
    user_email : EmailStr
    
# for login
class UserLogin(BaseModel):
    user_name : str
    user_password : str
    
# for creating new user  
class UserCreate(UserBase):
    user_password : str
    user_type : Literal[UserType.candidate,UserType.employer]
    
# for API response 
class UserResponse(UserBase):
    user_id : int
    user_type : UserType
    created_at : datetime

    class Config:
        from_attributes = True
        
        
# ========== Candidate Schemas ==========

# shared Base
class CandidateBase(BaseModel):
    resume_text : str
    
# for creating a candidate 
class CandidateCreate(CandidateBase):
    pass


# for API response
class CandidateResponse(CandidateBase):
    candidate_id : int
    user_id : int
    
    class Config:
        from_attributes = True 
        
        
# ========== Employer Schemas ==========

# shared Base
class EmployerBase(BaseModel):
    company_name : str
    company_description : str
    
# for creating an employer from a user
class EmployerCreate(EmployerBase):
    pass

# for API response
class EmployerResponse(EmployerBase):
    employer_id : int
    user_id: int
    
    class Config:
        from_attributes = True
        
            
# ========== Job Schemas ==========

# shared Base     
class JobBase(BaseModel):
    job_title : str
    job_description : str
    job_location : str
    skills_required : List[str]
    salary_range : str
    job_type : str

# Creating a job
class JobCreate(JobBase):
    pass

# for API Response
class JobResponse(JobBase):
    job_id : int
    company_id : int
    job_status : JobStatusEnum
    
    class Config:
        from_attributes = True
        
# changing job status
class JobStatusChange(BaseModel):
    job_status : Literal[JobStatusEnum.open,JobStatusEnum.closed,JobStatusEnum.paused]

# for detailed job view (include company name)
class JobDetailResponse(JobBase):
    job_id : int
    company_id : int
    job_status : JobStatusEnum
    company_name : Optional[str] = None
    
    class Config:
        from_attributes = True
    
    
    
    
    
# ========== Profile Schemas ==========

# Candidate Profile Response
class CandidateProfileResponse(BaseModel):
    user_type : UserType
    candidate_id : int
    user_name : str
    user_email : EmailStr
    resume_text : Optional[str] = None

    class Config:
        from_attributes = True

# Candidate profile changes
class CandidateProfileChange(BaseModel):
    resume_text : Optional[str] = None
    

# Employer Profile Response
class EmployerProfileResponse(BaseModel):
    user_type : UserType
    user_name : str
    user_email : EmailStr
    company_name : str
    company_description : str
    
    class Config:
        from_attributes = True
    
    
# Employer profile changes
class EmployerProfileChange(BaseModel):
    company_name : Optional[str] = None
    company_description : Optional[str] = None
    
    
    
    



# ========== Current User Schema ==========

# GET /user/me — returns identity after login
class UserMeResponse(BaseModel):
    user_id : int
    user_name : str
    user_email : EmailStr
    user_type : UserType
    profile_completed : bool

    class Config:
        from_attributes = True


# ========== Token Schemas ==========
class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    user_id: Optional[int] = None
