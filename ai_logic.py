import torch
from PIL import Image
from sentence_transformers import SentenceTransformer, util
from transformers import pipeline, CLIPProcessor, CLIPModel

# ==========================================
# TASK 2: RECOMMENDATION ENGINE (VIBE SEARCH)
# ==========================================
# Turns text into 384-dimensional vectors for vibe matching
embedder = SentenceTransformer('all-MiniLM-L6-v2')

locations = [
    "Kribi: Relaxing white sand beaches and the Lobe waterfalls.",
    "Limbe: Black sand volcanic beaches and botanical gardens.",
    "Buea: Hiking and adventure on the slopes of Mount Cameroon.",
    "Foumban: Cultural heritage and the Sultan's historic palace.",
    "Waza: Wildlife safaris and savannah landscapes in the North."
]

# Pre-calculate location vectors to make searching near-instant
location_embeddings = embedder.encode(locations, convert_to_tensor=True)

def get_vector_recommendation(user_query: str):
    query_embedding = embedder.encode(user_query, convert_to_tensor=True)
    hits = util.semantic_search(query_embedding, location_embeddings, top_k=1)
    best_match_index = hits[0][0]['corpus_id']
    score = hits[0][0]['score']
    return locations[best_match_index], score


# ==========================================
# TASK 3: MULTILINGUAL & VOICE SUPPORT
# ==========================================

# 1. Translation (NLLB-200) - Supports 200+ languages including French/English
translator = pipeline("translation", model="facebook/nllb-200-distilled-600M")

def translate_text(text: str, target_lang: str):
    # Example: 'fra_Latn' for French, 'eng_Latn' for English
    translation = translator(text, forced_src_lang="eng_Latn", tgt_lang=target_lang)
    return translation[0]['translation_text']

# 2. Voice (Whisper) - Understands accents and converts speech to text
speech_recognizer = pipeline("automatic-speech-recognition", model="openai/whisper-base")

def transcribe_audio(audio_file_path: str):
    result = speech_recognizer(audio_file_path)
    return result["text"]


# ==========================================
# TASK 4: HERITAGE RECOGNITION (CLIP)
# ==========================================

# Load the CLIP model for matching images to Cameroonian landmark labels
heritage_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
heritage_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

HERITAGE_SITES = [
    "Foumban Royal Palace",
    "Lobe Waterfalls Kribi",
    "Mount Cameroon Buea",
    "Reunification Monument Yaounde",
    "Limbe Botanical Garden",
    "Waza National Park"
]

def recognize_heritage_site(image_path: str):
    image = Image.open(image_path)

    # Process image and text labels together
    inputs = heritage_processor(
        text=HERITAGE_SITES, 
        images=image, 
        return_tensors="pt", 
        padding=True
    )

    outputs = heritage_model(**inputs)
    
    # Calculate probabilities for each site label
    probs = outputs.logits_per_image.softmax(dim=1) 
    best_match_idx = probs.argmax().item()
    
    return {
        "site_name": HERITAGE_SITES[best_match_idx],
        "confidence": round(float(probs[0][best_match_idx]), 4)
    }