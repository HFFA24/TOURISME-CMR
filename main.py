import os
import json
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from dotenv import load_dotenv

# 1. IMPORT ALL AI LOGIC FUNCTIONS FROM PHASE 2
from ai_logic import (
    get_vector_recommendation, 
    translate_text, 
    transcribe_audio, 
    recognize_heritage_site
)

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI()

# 2. Connectivity for Flutter/Web integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=GEMINI_API_KEY)

@app.get("/")
def read_root():
    return {"message": "TourismeCMR AI Engine (All Tasks 1-4) is Online"}


# --- TASK 4: HERITAGE RECOGNITION (IMAGE) ---

@app.post("/recognize-heritage")
async def heritage_recognition(file: UploadFile = File(...)):
    """
    Endpoint for Task 4: Heritage Recognition.
    Users upload a photo, and the AI (CLIP) identifies the Cameroonian site.
    """
    temp_image_path = f"temp_{file.filename}"
    with open(temp_image_path, "wb") as buffer:
        buffer.write(await file.read())
    
    try:
        result = recognize_heritage_site(temp_image_path)
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)
        
        return {"status": "Success", "recognition_result": result}
    except Exception as e:
        return {"status": "Error", "message": str(e)}


# --- TASK 3: MULTILINGUAL & VOICE ENDPOINTS ---

@app.get("/translate")
def get_translation(text: str, target_language: str = "fra_Latn"):
    """
    Translates text using NLLB-200. Default is French.
    """
    translated = translate_text(text, target_language)
    return {"original": text, "translated": translated}

@app.post("/voice-to-text")
async def voice_to_text(file: UploadFile = File(...)):
    """
    Receives an audio file and transcribes it using Whisper.
    """
    temp_audio_path = f"temp_{file.filename}"
    with open(temp_audio_path, "wb") as buffer:
        buffer.write(await file.read())
    
    try:
        text = transcribe_audio(temp_audio_path)
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
        return {"transcription": text}
    except Exception as e:
        return {"status": "Error", "message": str(e)}


# --- TASK 2: RECOMMENDATION ENGINE (VECTOR) ---

@app.get("/recommend-vibe")
def recommend_vibe(preference: str):
    """
    Uses Vector Embeddings to find similar destinations based on user 'vibe'.
    """
    recommendation, match_score = get_vector_recommendation(preference)
    return {
        "input_vibe": preference,
        "recommended_site": recommendation,
        "match_confidence": round(float(match_score), 4)
    }


# --- TASK 1: CHAT & ITINERARY (GEMINI) ---

@app.get("/chat")
def chatbot(user_id: str, message: str):
    """
    Gemini-powered chat that detects itinerary requests and returns structured JSON.
    """
    is_itinerary_request = any(word in message.lower() for word in ["plan", "itinerary", "schedule", "3 days"])
    base_instruction = "You are the TourismeCMR AI, a warm expert in Cameroonian tourism."

    if is_itinerary_request:
        system_prompt = base_instruction + """
        Provide a 3-day itinerary. Include realistic travel times.
        Format as ONLY JSON: {"trip_name": "...", "days": [{"day": 1, "activity": "...", "meal": "..."}]}
        """
        response_mime = "application/json"
    else:
        system_prompt = base_instruction + "Respond as a friendly chat partner."
        response_mime = "text/plain"

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type=response_mime,
                temperature=0.7 
            ),
            contents=message
        )
        if is_itinerary_request:
            return {"user_id": user_id, "type": "itinerary", "data": json.loads(response.text)}
        return {"user_id": user_id, "type": "chat", "bot_response": response.text}
    except Exception as e:
        return {"status": "Error", "message": str(e)}