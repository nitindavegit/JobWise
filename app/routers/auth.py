from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from ..import schemas

from app.db.database import get_db
import app.db.models.user as user_model
import app.utils as utils
import app.oauth2 as oauth2


router = APIRouter(
    tags=['Authentication']
)

@router.post("/login", response_model=schemas.Token)
async def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(user_model.User).filter(user_model.User.user_email == user_credentials.user_email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")
    if not utils.verify(user_credentials.user_password, user.user_password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

    access_token = oauth2.create_access_token(data={"user_id": user.user_id})

    return {"access_token": access_token, "token_type": "bearer"}