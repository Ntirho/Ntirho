from transformers import pipeline
from huggingface_hub import login
from dotenv import load_dotenv
import os
import torch

# Optional: use GPU if available
device = 0 if torch.cuda.is_available() else -1

# Load env
load_dotenv()

# Replace with your model path or Hugging Face repo ID
# Example: "TOM/whisper-sepedi-finetuned"
model_id = "omphulusa-mashau/whisper-finetuned-sepedi_model2"  # change to your fine-tuned model

# 1. Authenticate to Hugging Face (private model)
login(os.getenv("HF_TOKEN")) 

# Load the pipeline
asr = pipeline(
    task="automatic-speech-recognition",
    model="omphulusa-mashau/whisper-finetuned-sepedi_model2",
    tokenizer="omphulusa-mashau/whisper-finetuned-sepedi_processor2",
    feature_extractor="omphulusa-mashau/whisper-finetuned-sepedi_processor2",
    generate_kwargs={"max_length": 128}
)

# Data cleaner
def clean_transcription(text):
    parts = text.split()
    seen = set()
    cleaned = []
    for word in parts:
        if word not in seen:
            cleaned.append(word)
            seen.add(word)
    return " ".join(cleaned)

# Path to a local audio file (WAV, MP3, FLAC, etc.)
audio_path = "E:\\Datasets\\Sepedi-audio-SiDLar\\nchlt_nso\\audio\\202\\nchlt_nso_202f_0003.wav"  # change to one of your Sepedi test files

# Get audio
# audio = ffmpeg.audio(audio_path)

# Run transcription
print(f"Transcribing {audio_path}...")
result = asr(audio_path)

print("\n--- Transcription ---")
print(result["text"])
