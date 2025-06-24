import os
import pickle
import requests
import tensorflow as tf
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer
from fastapi.middleware.cors import CORSMiddleware

CACHE_DIR = "model_cache"

HF_MODEL_ID = os.getenv("HF_MODEL_ID")
LABEL_ENCODER_URL = os.getenv("LABEL_ENCODER_URL")

app = FastAPI(title="MoodMate ML API", description="API untuk prediksi mood berbasis teks.")

model = None
tokenizer = None
label_encoder = None

def download_file(url: str, destination: str):
    """Fungsi untuk mengunduh file dari URL dan menyimpannya ke destinasi."""
    print(f"Downloading file from {url}...")
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()  
        
        with open(destination, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"✅ File downloaded successfully to {destination}.")
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Failed to download file from {url}. Error: {e}")

@app.on_event("startup")
async def startup_event():
    """
    Fungsi ini akan dijalankan sekali saat aplikasi FastAPI pertama kali start.
    Tugasnya adalah mengunduh (jika perlu) dan memuat semua model ke memori.
    """
    global model, tokenizer, label_encoder
    
    os.makedirs(CACHE_DIR, exist_ok=True)
    
    if not HF_MODEL_ID:
        raise ValueError("Environment variable HF_MODEL_ID tidak di-set!")
    if not LABEL_ENCODER_URL:
        raise ValueError("Environment variable LABEL_ENCODER_URL tidak di-set!")
    
    print(f"Loading model '{HF_MODEL_ID}' from Hugging Face Hub...")
    tokenizer = AutoTokenizer.from_pretrained(HF_MODEL_ID, cache_dir=CACHE_DIR)
    model = TFAutoModelForSequenceClassification.from_pretrained(HF_MODEL_ID, cache_dir=CACHE_DIR)
    print("✅ Transformers Model & Tokenizer loaded.")

    label_encoder_path = os.path.join(CACHE_DIR, "label_encoder.pkl")
    if not os.path.exists(label_encoder_path):
        download_file(LABEL_ENCODER_URL, label_encoder_path)
        
    print(f"Loading Label Encoder from {label_encoder_path}...")
    with open(label_encoder_path, "rb") as f:
        label_encoder = pickle.load(f)
    print("✅ Label Encoder loaded.")
    print("🚀 Application startup complete. Ready to serve predictions.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://moodmate.up.railway.app"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    """Mendefinisikan skema data yang diharapkan dari request body."""
    text: str

@app.get("/health", summary="Cek status API dan model")
async def health_check():
    """Endpoint untuk health check, berguna untuk monitoring."""
    is_ready = all([model, tokenizer, label_encoder])
    return {
        "status": "OK" if is_ready else "Loading",
        "detail": "API is ready to serve predictions." if is_ready else "Model is loading, please wait."
    }

@app.post("/predict", summary="Prediksi mood dari teks")
async def predict(request: TextRequest):
    """Endpoint utama untuk melakukan prediksi mood."""
    if not all([model, tokenizer, label_encoder]):
        raise HTTPException(status_code=503, detail="Model is not ready yet, please try again in a moment.")
    
    try:
        inputs = tokenizer(request.text, return_tensors="tf", truncation=True, padding=True, max_length=128)
        outputs = model(**inputs)
        probabilities = tf.nn.softmax(outputs.logits, axis=1).numpy()[0]
        predicted_index = np.argmax(probabilities)
        confidence = float(probabilities[predicted_index])
        mood = label_encoder.inverse_transform([predicted_index])[0]
        
        return {
            "success": True,
            "mood": mood,
            "confidence": round(confidence * 100, 2)
        }
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred during prediction: {e}")