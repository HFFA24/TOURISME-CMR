import torch
import psycopg2
from PIL import Image
from sentence_transformers import SentenceTransformer, util
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline, CLIPProcessor, CLIPModel

# --- CONFIGURATION DB ---
DB_CONFIG = "dbname=tourismecm_db user=postgres password=Install2026 host=localhost"

def get_db_sites():
    print(f"Tentative de connexion avec config: {DB_CONFIG}") # Ajoute cette ligne
    """Récupère les sites dynamiquement depuis PostgreSQL"""
    conn = psycopg2.connect(DB_CONFIG)
    cur = conn.cursor()
    # Supposons une table 'sites' avec colonnes 'id', 'nom', 'description'
    cur.execute("SELECT nom, description FROM site_touristique")
    rows = cur.fetchall()
    conn.close()
    return [f"{row[0]}: {row[1]}" for row in rows]

# ==========================================
# TASK 2: RECOMMENDATION ENGINE
# ==========================================
embedder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', device='cpu')
# Chargement dynamique
locations = get_db_sites()
location_embeddings = embedder.encode(locations, convert_to_tensor=True)

def get_vector_recommendation(user_query: str):
    query_embedding = embedder.encode(user_query, convert_to_tensor=True)
    hits = util.semantic_search(query_embedding, location_embeddings, top_k=1)
    idx = hits[0][0]['corpus_id']
    return locations[idx], float(hits[0][0]['score'])

# ==========================================
# TASK 3: MULTILINGUAL & VOICE
# ==========================================
model_name = "facebook/nllb-200-distilled-600M"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

def translate_text(text, target_lang="fra_Latn"):
    inputs = tokenizer(text, return_tensors="pt")
    translated_tokens = model.generate(
        **inputs, 
        forced_bos_token_id=tokenizer.lang_code_to_id[target_lang]
    )
    return tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]

# ==========================================
# TASK 4: HERITAGE RECOGNITION
# ==========================================
heritage_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
heritage_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def recognize_heritage_site(image_path: str):
    image = Image.open(image_path)
    # Tu pourrais ici aussi charger les noms depuis la DB pour être synchro
    sites = ["Foumban Royal Palace", "Lobe Waterfalls", "Mount Cameroon", "Waza Park"]
    
    inputs = heritage_processor(text=sites, images=image, return_tensors="pt", padding=True)
    outputs = heritage_model(**inputs)
    probs = outputs.logits_per_image.softmax(dim=1) 
    idx = probs.argmax().item()
    
    return {
        "site_name": sites[idx],
        "confidence": round(float(probs[0][idx]), 4)
    }

def transcribe_audio(audio_path):
    # Ajoute le code pour transcrire l'audio ici
    return "Texte transcrit"