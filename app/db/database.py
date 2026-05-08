# defining the base class for the database
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()


# defining the database connection
# defining the session


from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..config import settings

SQLALCHEMY_DATABASE_URL = f"{settings.database_url}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()