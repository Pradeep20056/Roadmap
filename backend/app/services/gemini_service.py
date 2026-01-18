from google import genai
from google.genai import types
from app.core.config import settings
import json
import re

class GeminiService:
    def __init__(self):
        # NEW SDK: Create a client (no configure())
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def generate_roadmap(self, goal: str, duration_weeks: int) -> dict:
        prompt = f"""
You are a senior software mentor.

Create a structured {duration_weeks}-week learning roadmap.

Skill Goal: {goal}

For each week include:
- Week number
- Title
- Learning objectives
- Key topics
- Free learning resources (YouTube, docs, websites) as strings like "Title - URL"
- Mini project idea

Return ONLY valid JSON.

JSON FORMAT:
{{
  "title": "",
  "total_weeks": {duration_weeks},
  "weeks": [
    {{
      "week": 1,
      "title": "",
      "objectives": [],
      "topics": [],
      "resources": [],
      "mini_project": ""
    }}
  ]
}}
"""

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )

            text = response.text.strip()
            # Clean markdown code blocks if present
            text = re.sub(r'^```json\s*', '', text, flags=re.MULTILINE)
            text = re.sub(r'^```\s*', '', text, flags=re.MULTILINE)
            text = text.strip()
            
            return json.loads(text)

        except Exception as e:
            print("Gemini error:", e)
            return {
                "title": f"Failed to generate roadmap for {goal}",
                "total_weeks": 0,
                "weeks": []
            }

gemini_service = GeminiService()
