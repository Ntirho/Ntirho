# Ntirho Backend

The backend for **Ntirho**, a multilingual employment platform designed to empower users across South Africa through voice-driven job discovery. This service handles automatic speech recognition (ASR), allowing language-aware searches using FastAPI and Hugging Face's Whisper model fine-tuned for Sepedi.

---

## 🚀 Features

- 🎙️ Voice-to-Text ASR using Hugging Face Whisper (Sepedi fine-tuned)
- 🔐 Private Model Access with secure Hugging Face token integration
- ⚡ FastAPI backend with CORS support for frontend communication

---

## 🧱 Tech Stack

- Python 3.10+
- FastAPI
- Hugging Face Transformers
- Uvicorn + Gunicorn (for production deployment)

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Ntirho/backend.git
cd backend
```

### 2. Create a virtual environment:
```bash
python -m venv myvenv
myvenv/Scripts/activate.ps1
```
  
### 3. Install dependencies:
```bash
pip install -r requirements.txt
```

### 4. Set the environment variables:
- Create a .env file in this root folder
- add: *HF_TOKEN=hf_your_client_token_here*

### 5. Run API:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
