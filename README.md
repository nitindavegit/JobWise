# JobWise

JobWise is a FastAPI backend for candidate-employer job matching.

It supports:
- user signup and login with JWT auth
- candidate profile update and resume upload (PDF to text)
- employer profile update
- job creation, listing, and status updates
- basic recommendation endpoint based on skill/text overlap

## Current Status

- Core backend APIs are implemented and running.
- Database models and Alembic migrations are present.
- Recommendation logic exists as a basic MVP.
- Test coverage and production hardening are still pending.

## Tech Stack

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Pydantic Settings

## Quick Start (Windows / PowerShell)

1. Create and activate virtual environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies

```powershell
pip install -r requirements.txt
```

3. Create your environment file

```powershell
copy .env.example .env
```

Then update `.env` values for your local PostgreSQL setup.

4. Run database migrations

```powershell
alembic upgrade head
```

5. (Optional) Seed sample data

```powershell
python seeds.py
```

6. Start API server

```powershell
uvicorn app.main:app --reload
```

Swagger docs: `http://127.0.0.1:8000/docs`

## Main API Endpoints

- `GET /`
- `POST /user/`
- `POST /login`
- `PATCH /candidate/update-profile`
- `GET /candidate/my-profile`
- `POST /candidate/upload-resume`
- `GET /candidate/recommend-jobs`
- `PATCH /employer/update-profile`
- `GET /employer/my-profile`
- `POST /job/create-job`
- `GET /job/my-jobs`
- `PATCH /job/update-job-status/{job_id}`

## Auth Notes

- Use `/login` to get `access_token`.
- In Swagger, click `Authorize` and send token as `Bearer <token>`.
- Role checks are enforced per route (`candidate` vs `employer`).

## Next Development Priorities

1. Add integration tests for auth, profiles, jobs, and recommendations.
2. Improve recommendation quality (ranking/scoring).
3. Add `.env` validation and clearer startup errors.
4. Add deployment and CI instructions.
