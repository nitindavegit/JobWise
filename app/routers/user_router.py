from fastapi import APIRouter, Depends, Response, status, HTTPException
from app import schemas, utils
from app.db.models.user import User
from app.db.models.candidate import Candidate
from app.db.models.employer import Employer
from sqlalchemy.orm import Session
from app.db.database import get_db
router = APIRouter(
    prefix="/user",
    tags = ['User']
)

# create a user
@router.post("/",status_code=status.HTTP_201_CREATED,response_model=schemas.UserResponse)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_username = db.query(User).filter(User.user_name == user.user_name).first()
    if existing_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Username '{user.user_name}' is already taken")
    
    existing_email = db.query(User).filter(User.user_email == user.user_email).first()
    if existing_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Email '{user.user_email}' is already registered")
    
    hashed_password = utils.hash(user.user_password)
    user.user_password = hashed_password
    new_user = User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Based on the user type, create a corresponding record in the respective table whether it is a candidate or employer
    if user.user_type == schemas.UserType.candidate:
        candidate = Candidate(user_id=new_user.user_id)
        db.add(candidate)
    
    elif user.user_type == schemas.UserType.employer:
        employer = Employer(user_id=new_user.user_id)
        db.add(employer)
        
    db.commit()
    return new_user

