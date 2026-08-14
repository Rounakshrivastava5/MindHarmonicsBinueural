# 🎵 MindHarmonics - Custom Affirmation & Binaural Beat Web Studio

**MindHarmonics** is a full-stack web application designed to help users create, customize, generate, and stream personal audio tracks combining text-to-speech affirmations with background binaural beat carrier waves across health, wealth, focus, height growth, self-love, and deep sleep genres.

Explore the live app and share your feedback 
Vercel - https://mind-harmonics-binueural.vercel.app/
Cloud Flare - https://plasma-newport-base-reid.trycloudflare.com

---

## ✨ Core Features

- **🎧 Precision Binaural Beat Carrier Waves:** Synthesizes stereo carrier frequencies with custom differential binaural beat shifts across Delta (0.5–4Hz), Theta (4–8Hz), Alpha (8–13Hz), Beta (13–30Hz), and Gamma (30–50Hz).
- **🗣️ Bilingual Text-to-Speech Engine:** High-quality Microsoft Neural Voices for both **English (en-US)** and **Hindi (hi-IN)** spoken affirmations.
- **🎛️ Dual-Volume Mixer:** Custom speech-to-binaural volume ratios and carrier frequency tuning.
- **✉️ Email Authentication:** User Sign Up, Login, and Logout with PBKDF2 SHA256 password hashing and JWT access tokens.
- **🌙/☀️ Dual Theme System:** Seamless Light and Dark mode toggles with persistent theme memory.
- **🇬🇧/🇮🇳 Language Switcher:** Instant English and Hindi language toggle across the entire application interface.
- **💡 Developer Suggestions & Free Sample Reader:** Curated Law of Attraction and Mind Power book recommendations with native in-app sample chapter reader and direct Amazon store links.
- **📊 Real-time Audio Visualizers:** Interactive Canvas sine wave visualizer during audio synthesis and playback.

---

## 🛠️ Technology Stack

- **Frontend:** Angular v17+ (Standalone Components, RxJS, Angular Signals, Vanilla CSS design system)
- **Backend:** Python FastAPI (Async Framework), Uvicorn
- **Audio Engine:** `scipy`, `numpy`, `edge-tts`, `miniaudio`, `pydub`
- **Database & ORM:** SQLite (Async SQLAlchemy + Alembic)
- **Authentication:** PBKDF2 HMAC SHA256 + PyJWT (JSON Web Tokens)

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
# Activate virtual environment:
# Windows: .\venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

pip install -r requirements.txt
python -m app.core.init_db
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend API will be running at `http://127.0.0.1:8000/api/v1` and interactive Swagger docs at `http://127.0.0.1:8000/api/v1/docs`.

### 2. Frontend Setup (Angular v17+)

```bash
cd frontend
npm install
npx ng serve --port 4200
```

Access the Web Application at `http://localhost:4200`.

---

## 📜 License

MIT License. Built with ❤️ for Mind & Manifestation.
