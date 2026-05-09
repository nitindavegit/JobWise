from fastapi import FastAPI
from .routers import user_router,candidate_router,employer_router,job_router,auth

app = FastAPI()

@app.get("/")
def demo():
    return {"message":"Hi, My API is working??"}

app.include_router(user_router.router)
app.include_router(candidate_router.router)
app.include_router(employer_router.router)
app.include_router(job_router.router)
app.include_router(auth.router)