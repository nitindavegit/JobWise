import os

from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Set config env vars before importing app modules.
os.environ.setdefault("DATABASE_URL", "sqlite:///./test_jobwise.db")
os.environ.setdefault("DATABASE_HOSTNAME", "localhost")
os.environ.setdefault("DATABASE_PORT", "5432")
os.environ.setdefault("DATABASE_PASSWORD", "test")
os.environ.setdefault("DATABASE_NAME", "test_db")
os.environ.setdefault("DATABASE_USERNAME", "test_user")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

from app.db.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402
from app.db.models.user import User  # noqa: F401, E402
from app.db.models.candidate import Candidate  # noqa: F401, E402
from app.db.models.employer import Employer  # noqa: F401, E402
from app.db.models.job import Job  # noqa: F401, E402
from app.db.models.application import Application  # noqa: F401, E402

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_jobwise.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function", autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def client():
    return TestClient(app)
