from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_frontend_origins
from app.routers.calendar import router as calendar_router
from app.routers.contests import router as contests_router
from app.routers.profile import router as profile_router
from app.routers.questions import router as questions_router

app = FastAPI(title="LeetLens API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_frontend_origins(),
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(profile_router)
app.include_router(questions_router)
app.include_router(contests_router)
app.include_router(calendar_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
