# JobWise 🚀

JobWise is a next-generation, automated hiring platform that seamlessly connects employers with top-tier candidates. Built with a stunning, modern React frontend and a robust FastAPI backend, JobWise automatically parses resumes, calculates algorithmic match scores, and provides a buttery-smooth SaaS user experience.

---

## ✨ Features

### For Candidates
*   **Intelligent Onboarding:** Upload your resume (PDF) and JobWise automatically parses your skills and text using PyPDF2.
*   **Smart Match Dashboard:** Instantly view jobs sorted by a dynamic Match Score algorithm comparing your parsed skills against the employer's requirements.
*   **One-Click Apply:** Premium UI interactions let you apply for jobs seamlessly.

### For Employers
*   **Job Management:** Create, edit, and manage job listings with custom salary ranges and skill arrays.
*   **Applicant Tracking:** View beautifully formatted applicant cards featuring match scores, dynamic statuses (Applied, Reviewing, Accepted, Rejected), and quick-action controls.

### Technical & UI Highlights
*   **Unified Design System:** A strictly enforced CSS architecture utilizing CSS Variables (`index.css`) for flawless cross-component consistency (Dark Slate, Coral, Emerald accents).
*   **Premium Interactions:** Physics-based CSS hover transitions for a 60fps "Framer Motion" style premium feel.
*   **Secure Auth:** JWT-based authentication using bcrypt hashing. Accounts are strictly validated (lowercased, spaceless usernames) and secured via Email login.

---

## 🛠️ Tech Stack

**Frontend:**
*   React (Vite)
*   React Router DOM
*   Phosphor Icons (Premium UI assets)
*   Vanilla CSS (CSS Variables Design System architecture)

**Backend:**
*   FastAPI (Python)
*   SQLAlchemy (ORM) & Alembic (Migrations)
*   PostgreSQL
*   PyPDF2 (Resume parsing)
*   Passlib & python-jose (JWT Auth)

---

## 💻 Local Development Setup

### 1. Backend Setup

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
   * Copy `.env.example` to `.env`.
   * Update the `DATABASE_URL` to point to your local PostgreSQL instance.

4. Run database migrations to build the tables:
   ```bash
   alembic upgrade head
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *(Backend runs on `http://localhost:8000`. Swagger API docs available at `http://localhost:8000/docs`)*

### 2. Frontend Setup

1. Open a **new** terminal and navigate to the frontend directory:
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
   *(Frontend runs on `http://localhost:5173`)*

---

## 🚀 Production Deployment & Mock Data

When deploying JobWise to a live production environment (e.g., Vercel + Render + Supabase Postgres), your database will start completely empty. 

We have provided a brilliant automated **Live Seeder** strategy to instantly populate your live site for demonstrations:

1. **Sign Up Live:** Go to your hosted website and manually sign up two users:
   * **Employer:** Username: `jhonnykhanna`, Email: `jhonnykhanna@gmail.com`, Password: `Jhonnykhanna1@gmail.com`
   * **Candidate:** Username: `sofiasharma`, Email: `sofiasharma@gmail.com`, Password: `Sofiasharma1@gmail.com`
   *(This ensures your production server securely bcrypts their passwords and generates valid JWT tokens natively).*

2. **Run the Seeder:** Open your production database console (e.g., Supabase SQL Editor or pgAdmin). Copy the entire contents of the **`live_seeder.sql`** file located in the root of this repository, paste it into the editor, and run it.

3. **Magic!** The SQL script will dynamically locate Jhonny and Sofia by their emails, perfectly inject their company profiles, generate 3 professional jobs, and automatically simulate applications between them with precise Match Scores!

---
*Built with ❤️ for the future of hiring.*
