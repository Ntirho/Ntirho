# Ntirho 🌍

**Ntirho** is an AI-powered job matching platform designed to empower underserved communities by connecting individuals with local employment opportunities. The system supports voice and text input in indigenous South African languages (e.g., Sepedi, Tsonga, Tshivenda), making it accessible to users with limited digital literacy.

---

## 🚀 Project Vision

Traditional platforms like LinkedIn often fail to reflect the realities of rural job seekers. Ntirho bridges this gap by offering:

- Skill-based job matching
- Multilingual support (including local dialects)
- Voice input and translation via NLP and ASR
- A user-friendly interface tailored for accessibility

---

## 🧱 Tech Stack

| Layer              | Technology         |
|-------------------|--------------------|
| Frontend           | Angular            |
| Backend            | Python (FastAPI)   |
| Database & Auth    | Supabase (PostgreSQL) |
| Voice-to-Text      | OpenAI Whisper / Google Speech API |
| Translation/NLP    | spaCy / transformers / Zabantu-XLMR |
| Prototyping        | Firebase Studio    |

---

## 📦 Features (Increment 1)

- ✅ User registration and profile setup
- ✅ Job posting and browsing
- ✅ Basic job-user matching logic
- ✅ Static Tsonga UI translation
- ✅ Voice input prototype (UI only)

---

## 🗃️ Database Schema

### `users`
- `id`: UUID
- `name`: Text
- `email`: Text
- `location`: Text
- `skills`: Text[]
- `interests`: Text[]

### `jobs`
- `id`: UUID
- `title`: Text
- `company`: Text
- `location`: Text
- `description`: Text
- `required_skills`: Text[]

### `matches`
- `id`: UUID
- `user_id`: UUID
- `job_id`: UUID
- `match_score`: Float
- `matched_skills`: Text[]

### `voice_inputs`
- `id`: UUID
- `user_id`: UUID
- `original_text`: Text
- `translated_text`: Text
- `intent`: Text

---

## 🧠 NLP & ASR Strategy

- **ASR**: Transcribe Tsonga/Sepedi/Tshivenda using Whisper or NCHLT corpus
- **Translation**: Use rule-based or fine-tuned models (Zabantu-XLMR)
- **Intent Detection**: Classify user queries (e.g., “Find jobs near me”)

---

## 📐 Design Approach

- Hybrid design strategy using Firebase Studio:
  - Full app feature map
  - Detailed first increment screens
- Mobile-first UI with multilingual toggle
- Accessibility-focused layout for rural users

---

## 🛠️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/Lusa1101/Ntirho.git
cd Ntirho

# Install backend dependencies
pip install -r requirements.txt

# Run backend server
uvicorn main:app --reload

# Frontend setup (Angular)
cd frontend
npm install
ng serve
