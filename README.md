# JobWise

A minimal job-matching backend built with FastAPI, SQLAlchemy and Alembic. This README was generated from the project's internal roadmap and provides a quick start, current status, API surface summary, and next steps to make the project runnable and production-ready. ✅

---

## Project Status (Roadmap)

- **Week 1: Project Setup & Models** — ✅ Completed
  - FastAPI backend scaffolded
  - PostgreSQL (intended) database setup
  - SQLAlchemy models and Alembic migrations created
  - Core models: `User`, `Candidate`, `Employer`, `Job`
  - Pydantic schemas for API payloads and responses

- **Week 2: Core APIs – User, Resume, Jobs** — 🛠️ In Progress
  - `/signup` — accept name, email, password; hashes and stores user ✅ (basic)
  - `/upload_resume` — accept resume text and link to `candidates` (work in progress)
  - Seed jobs (5–10 demo entries) (planned)
  - `/login` — JWT authentication (implemented)

- **Week 3: Basic Matching** — ⏳ Upcoming
  - Parse resume text for keywords
  - Compare keywords to job skills and descriptions
  - Build `/recommend_jobs` endpoint returning top matches

- **Week 4–5: Enhancements & Polishing** — ⏳ Upcoming
  - Improve matching with TF-IDF / embeddings (optional)
  - Clean responses, documentation, prepare frontend plan

---

## Quick Start (development)

> Note: The repository currently lacks a `requirements.txt` and `.env`. The steps below assume these will be added. If you prefer SQLite for local development, add `SQLALCHEMY_DATABASE_URL=sqlite:///./jobwise.db` to `.env`.

1. Create and activate a Python virtualenv

```bash
python -m venv .venv
# Windows
.\.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate
```

2. Install dependencies (create and maintain `requirements.txt`)

```bash
pip install -r requirements.txt
```

Suggested minimal dependencies:
- fastapi
- uvicorn[standard]
- sqlalchemy
- alembic
- pydantic-settings
- python-jose
- passlib[bcrypt]
- psycopg2-binary (or use SQLite and remove this requirement)

3. Create a `.env` (or `.env.local`) with the keys expected in `app/config.py`:

```text
DATABASE_URL=postgresql://user:password@localhost:5432/jobwise
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

4. Apply migrations (if using Postgres)

```bash
alembic upgrade head
```

(As a quick alternative during early development you may call SQLAlchemy create_all).

5. Run the app

```bash
uvicorn app.main:app --reload
```

Visit `http://127.0.0.1:8000/docs` to see the API docs.

---

## API Surface (high level)

- `GET /` — basic health/demo endpoint
- `POST /user/` — create a user (signup)
- `POST /login` — returns JWT token (OAuth2 password grant)
- `PATCH /candidate/update-profile` — create/update candidate resume/profile
- `GET /candidate/my-profile` — get candidate profile
- `PATCH /employer/update-profile` — create/update employer profile
- `GET /employer/my-profile` — get employer profile
- `POST /job/create-job` — employer creates a job
- `GET /job/my-jobs` — employer lists own jobs
- `PATCH /job/update-job-status/{job_id}` — employer updates job status

Notes:
- Authentication uses JWT token in Bearer header. The current `oauth2.get_current_user` returns token data (`user_id`) and routers fetch the full `User` from DB.

---

## Immediate Action Items / Known Issues

These tasks are recommended to make the project runnable and developer-friendly:

1. Add a `requirements.txt` (or `pyproject.toml`) with the required packages.
2. Add a `.env.example` showing keys expected in `app/config.py`.
3. Fix import inconsistencies and minor syntax issues (some files use broken relative imports and typos).
4. Resolve schema name mismatches (e.g., `JobStatusUpdate` vs `JobStatusChange`).
5. Decide on a local DB strategy (SQLite for quick local DX or Postgres for parity) and ensure Alembic configs match.
6. Add basic integration tests and seed data for jobs (5–10 sample jobs) to enable matching/testing.
7. Implement `/recommend_jobs` using simple keyword matching; later improve with TF-IDF or embeddings.

---

## Contributing and Next Steps

- Complete Week 2 tasks fully before moving to matching logic.
- Add test coverage for user flows, profile updates, job creation, and auth.
- Build a small admin/UI or Postman collection for manual testing.

---

If you'd like, I can:
- Create `requirements.txt` and `.env.example` now,
- Fix the import typos and schema mismatches,
- Seed demo jobs and add a `/recommend_jobs` MVP.

Tell me which of these you'd like me to do next and I will prepare a clear PR with changes. ✅
