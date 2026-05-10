from fastapi import FastAPI
from .routers import user_router,candidate_router,employer_router,job_router,auth
from .validator import validation_on_startup

app = FastAPI()

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