from fastapi import FastAPI, Response, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from fastapi.middleware.cors import CORSMiddleware
from .routers import user_router,candidate_router,employer_router,job_router,auth,application_router
from .validator import validation_on_startup
from app.db.database import get_db

app = FastAPI()

# CORS — allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://jobwiseplatform.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    validation_on_startup()

@app.get("/")
def demo():
    return {"message":"Hi, My API is working??"}

@app.head("/health")
def health():
    return Response(status_code=200)

@app.get("/healthz")
def health_check_db(db:Session = Depends(get_db)):
    try:
        # running a micro query to activate the database
        db.execute(text("SELECT 1"))
        return {"status" : "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

app.include_router(user_router.router)
app.include_router(candidate_router.router)
app.include_router(employer_router.router)
app.include_router(job_router.router)
app.include_router(auth.router)
app.include_router(application_router.router)