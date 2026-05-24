from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import user_router,candidate_router,employer_router,job_router,auth,application_router
from .validator import validation_on_startup

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

app.include_router(user_router.router)
app.include_router(candidate_router.router)
app.include_router(employer_router.router)
app.include_router(job_router.router)
app.include_router(auth.router)
app.include_router(application_router.router)