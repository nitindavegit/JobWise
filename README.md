<p align="center">
  <img src="./github-logo.png" alt="JobWise Logo" width="200" />
</p>

<h1 align="center">JobWise</h1>

<p align="center">
  <strong>A next-generation, automated hiring platform connecting employers with top-tier candidates.</strong>
</p>

<p align="center">
  <a href="https://jobwiseplatform.netlify.app/"><strong>View Live Platform</strong></a>
</p>

<hr />

## Overview

JobWise originated as a purely Python-based backend API, created to explore advanced backend architecture and data processing. Realizing the core logic was robust and highly scalable, I decided to take the project Full-Stack. Utilizing AI and modern UI principles to accelerate the design workflow, I conceptualized and built a stunning React frontend architecture to bring the Python engine to life. 

What started as a learning exercise is now a fully functional, sleek SaaS hiring platform.

## Key Features

### Candidate Experience
- **Intelligent Onboarding:** Candidates can upload their resumes (PDF format), and the system automatically extracts and categorizes their skills using PyPDF2.
- **Smart Match Dashboard:** Candidates instantly view active jobs sorted by a dynamic Match Score algorithm that compares their parsed skills against the employer's requirements.
- **Frictionless Application:** Premium UI interactions allow candidates to apply for jobs seamlessly with real-time status tracking.

### Employer Experience
- **Job Management:** Employers can create, edit, and manage job listings with custom salary ranges, locations, and structured skill arrays.
- **Applicant Tracking System (ATS):** Employers receive beautifully formatted applicant cards featuring match scores and dynamic statuses (Applied, Reviewing, Accepted, Rejected), alongside quick-action controls.

### Technical & UI Architecture
- **Unified Design System:** A strictly enforced CSS architecture utilizing CSS Variables (`index.css`) ensures flawless cross-component consistency.
- **Premium Interactions:** Physics-based CSS hover transitions simulate a high-end "Framer Motion" style premium feel.
- **Secure Authentication:** JWT-based authentication using bcrypt hashing. Accounts are strictly validated and secured via Email login protocols.

---

## Tech Stack

**Frontend Architecture:**
- React (Vite)
- React Router DOM
- Phosphor Icons
- Vanilla CSS (Custom CSS Variables Design System)

**Backend Architecture:**
- FastAPI (Python)
- SQLAlchemy (ORM) & Alembic (Migrations)
- PostgreSQL
- PyPDF2 (Resume parsing)
- Passlib & python-jose (JWT Auth)

---

## Local Development Setup

### 1. Backend Environment

1. Open a terminal in the root directory and create a virtual environment:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1  # Windows
   # source .venv/bin/activate    # Mac/Linux
   ```

2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Setup your PostgreSQL Database & Environment Variables:
   - Copy `.env.example` to `.env`.
   - Update the `DATABASE_URL` to point to your local PostgreSQL instance.

4. Run database migrations to build the schema:
   ```bash
   alembic upgrade head
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *(The backend runs on `http://localhost:8000`. Swagger API documentation is automatically generated at `http://localhost:8000/docs`)*

### 2. Frontend Environment

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *(The frontend runs on `http://localhost:5173`)*

---

## Production Deployment & Mock Data Seeding

When deploying JobWise to a live production environment (e.g., Netlify + Render + Supabase), the PostgreSQL database will initialize empty. 

To easily populate the live environment for demonstrations or portfolio showcases, follow this automated Live Seeder strategy:

1. **Sign Up Live:** Navigate to your hosted website (`https://jobwiseplatform.netlify.app/`) and manually register the two demo users:
   - **Employer:** Username: `jhonnykhanna`, Email: `jhonnykhanna@gmail.com`, Password: `Jhonnykhanna1@gmail.com`
   - **Candidate:** Username: `sofiasharma`, Email: `sofiasharma@gmail.com`, Password: `Sofiasharma1@gmail.com`
   *(This ensures your production server securely bcrypts the passwords and generates valid JWT tokens natively).*

2. **Execute the Seeder Script:** Open your production database console (e.g., Supabase SQL Editor). Copy the entire contents of the `live_seeder.sql` file located in the root of this repository, paste it into the editor, and execute it.

3. **Validation:** The SQL script uses CTEs (Common Table Expressions) to dynamically locate the accounts by their emails, inject company profiles, generate professional job listings, and automatically simulate applications between them with precise Match Scores.

---

*Engineered with precision for the future of hiring.*
