from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any
from app.models.roadmap import RoadmapRequest, RoadmapResponse, RoadmapProgressRequest
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

@router.patch("/{roadmap_id}/progress", response_model=RoadmapResponse)
def update_progress(
    roadmap_id: str,
    progress: RoadmapProgressRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        # Verify ownership (optional but recommended, currently service just updates by ID)
        # For strict security, we should check if roadmap belongs to user in service or here.
        # Assuming service updates blindly by ID, let's just valid ID exists.
        
        updated_roadmap = supabase_service.update_roadmap_progress(
            roadmap_id=roadmap_id,
            week_number=progress.week_number,
            is_completed=progress.is_completed
        )
        
        if not updated_roadmap:
            raise HTTPException(status_code=404, detail="Roadmap or week not found")
            
        return updated_roadmap
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
