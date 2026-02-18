from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import auth, roadmap

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS defaults - Allow all for development mainly, strict for pro

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://roadmap-two-sigma.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(roadmap.router, prefix=f"{settings.API_V1_STR}/roadmap", tags=["roadmap"])

@app.get("/")
def root():
    return {"message": "AI Learning Roadmap Generator API is running"}
