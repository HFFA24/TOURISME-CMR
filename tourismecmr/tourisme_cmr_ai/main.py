import os
import json
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Importation de tes fonctions
from ai_logic import (
    recognize_heritage_site, 
    translate_text, 
    transcribe_audio, 
    get_vector_recommendation
)

load_dotenv()

# Initialisation du client
# Utilise "gemini-1.5-flash" qui est le plus stable pour la plupart des clés
app = FastAPI(title="TourismeCMR AI API")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "message": "Bienvenue sur l'API TourismeCMR"}

# --- TASK 1: CHAT & ITINERARY ---
@app.get("/chat")
def chatbot(user_id: str, message: str):
    try:
        print(f"DEBUG: Tentative d'appel Gemini avec le modèle gemini-1.5-flash")
        
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=message,
            config=types.GenerateContentConfig(
                system_instruction="You are TourismeCMR AI, expert in Cameroon.",
                temperature=0.7 
            )
        )
        return {"user_id": user_id, "type": "chat", "bot_response": response.text}
        
    except Exception as e:
        # Affiche TOUT le contenu de l'erreur dans le terminal
        print("--- ERREUR DÉTAILLÉE ---")
        print(e) 
        print("------------------------")
        raise HTTPException(status_code=500, detail=str(e))