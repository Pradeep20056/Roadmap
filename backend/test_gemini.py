import os
import sys
import asyncio

# Add the current directory to sys.path
sys.path.append(os.getcwd())

from app.services.gemini_service import gemini_service

async def test_generation():
    print("Testing Gemini generation...")
    try:
        result = await gemini_service.generate_roadmap("Learn Python", 4)
        print("Success!")
        print(result.get("title"))
        if not result.get("weeks"):
            print("Warning: No weeks generated.")
            print(result)
    except Exception as e:
        print(f"Test failed with error: {e}")

if __name__ == "__main__":
    asyncio.run(test_generation())
