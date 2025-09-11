import os
from fastapi import FastAPI, File, UploadFile
from transformers import pipeline
from tempfile import NamedTemporaryFile
from huggingface_hub import login
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load the .env
load_dotenv()


# 1. Authenticate to Hugging Face (private model)
login(token=os.getenv("HF_TOKEN"))  # Set HF_TOKEN in your environment

# 2. Load your fine-tuned Sepedi Whisper model
asr = pipeline(
    task="automatic-speech-recognition",
    model="Ntirho/whisper-finetuned-sepedi_model",
    tokenizer="Ntirho/whisper-finetuned-sepedi_model",
    feature_extractor="Ntirho/whisper-finetuned-sepedi_model",
    generate_kwargs={"max_length": 128}
)

asr2 = pipeline(
    task="automatic-speech-recognition",
    model="Ntirho/whisper-finetuned-sepedi_model-v2",
    tokenizer="Ntirho/whisper-finetuned-sepedi_processor-v2",
    feature_extractor="Ntirho/whisper-finetuned-sepedi_processor-v2",
    generate_kwargs={"max_length": 128}
)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    with NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Run transcription
    result = asr(tmp_path)

    # Clean up temp file
    os.remove(tmp_path)

    # Print
    print("transcription", result["text"])

    return {"transcription": result["text"]}

# Second model version
@app.post("/transcribe_2")
async def transcribe(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    with NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Run transcription
    result = asr2(tmp_path)

    # Clean up temp file
    os.remove(tmp_path)

    # Print
    print("transcription", result["text"])

    return {"transcription": result["text"]}

# "C:\Users\omphu\OneDrive\Desktop\nchlt_nso_202f_0003.wav"