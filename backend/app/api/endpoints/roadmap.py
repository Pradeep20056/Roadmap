from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any
from app.models.roadmap import RoadmapRequest, RoadmapResponse
from app.services.gemini_service import gemini_service
from app.services.supabase_service import supabase_service
from app.api.endpoints.auth import get_current_user

router = APIRouter()

@router.post("/generate", response_model=RoadmapResponse)
async def generate_roadmap(
    request: RoadmapRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        # 1. Generate via AI
        generated_map = await gemini_service.generate_roadmap(
            goal=request.goal, 
            duration_weeks=request.duration_weeks
        )
        
        # 2. Save to Supabase
        saved_roadmap = supabase_service.create_roadmap(
            user_id=current_user['id'],
            goal=request.goal,
            duration=request.duration_weeks,
            roadmap_json=generated_map
        )
        
        if not saved_roadmap:
            raise HTTPException(status_code=500, detail="Failed to save roadmap")
            
        return saved_roadmap

    except Exception as e:
        print(f"Generate Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[RoadmapResponse])
def get_history(current_user: dict = Depends(get_current_user)):
    try:
        roadmaps = supabase_service.get_user_roadmaps(current_user['id'])
        return roadmaps
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
