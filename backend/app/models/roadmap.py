from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class RoadmapRequest(BaseModel):
    goal: str
    duration_weeks: int

class RoadmapProgressRequest(BaseModel):
    week_number: int
    is_completed: bool

class RoadmapResponse(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    goal: str
    duration_weeks: int
    roadmap_json: Dict[str, Any]
    created_at: Optional[datetime] = None

# Helper models for the JSON structure (optional, but good for validation)
class WeeklyPlan(BaseModel):
    week: int
    title: str
    objectives: List[str]
    topics: List[str]
    resources: List[str]
    mini_project: str
    isCompleted: bool = False

class RoadmapStructure(BaseModel):
    title: str
    total_weeks: int
    weeks: List[WeeklyPlan]
