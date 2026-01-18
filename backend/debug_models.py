import os
import sys

# Add the current directory to sys.path to make 'app' importable
sys.path.append(os.getcwd())

from google import genai
from app.core.config import settings

def list_models():
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        print("Successfully created client. Listing models...")
        # The new SDK might use a different iterator, but let's try the common pattern or just check what works.
        # Based on new SDK docs, it might be client.models.list()
        pager = client.models.list() 
        for model in pager:
            print(f"Model: {model.name}")
            if 'generateContent' in model.supported_generation_methods:
                print(f"  - Supports generateContent")
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    list_models()
