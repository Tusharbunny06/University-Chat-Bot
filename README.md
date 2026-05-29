# 🎓 AI University Chatbot 

A modern, fast, and feature-rich AI-powered FAQ Chatbot for **HSR TechRise**, designed to assist students, parents, and visitors with inquiries regarding admissions, course details, fees, hostel facilities, academic rules, and campus placements.

🚀 **Live Demo:** [university-chat-bot-frontend.vercel.app](https://university-chat-bot-frontend.vercel.app/)

---

## ✨ Features

*   **⚡ Speed-of-Thought Responses**: Powered by **Groq LPU Inference** using the state-of-the-art `llama-3.3-70b-versatile` model, delivering near-instant answers.
*   **🎙️ Voice Input (Speech-to-Text)**: Students can click the microphone icon and speak their questions directly.
*   **🔊 Voice Output (Text-to-Speech)**: The chatbot reads responses aloud using natural speech synthesis.
*   **🌐 Multilingual Support**: Chat in **English**, **Hindi (हिन्दी)**, **Spanish (Español)**, **French (Français)**, or **German (Deutsch)**.
*   **💬 Quick Suggestions**: One-click prompt chips for popular topics like Fees, Admissions, Placements, and Hostels.
*   **🎨 Premium Glassmorphic UI**: Beautiful dark-mode interface with smooth micro-animations, tailored specifically for a premium look and feel.
*   **📱 Fully Responsive**: Optimized for desktop, tablets, and mobile screens.

---

## 🛠️ Tech Stack

### Frontend
*   **React (Vite)** – High-performance React toolchain.
*   **Axios** – Promise-based HTTP client for API requests.
*   **Lucide React** – Sleek, modern icons.
*   **Vanilla CSS** – Tailored dark glassmorphic UI design.

### Backend
*   **Node.js & Express** – Lightweight web framework.
*   **Groq SDK** – Integration with Groq LPU API.
*   **Vercel Serverless Functions** – Seamless, cost-efficient serverless hosting.

---

## 📂 Project Structure

```text
college-chatbot/
├── frontend/                 # React Frontend & Serverless Backend
│   ├── api/
│   │   └── index.js          # Express app / Vercel Serverless Entrypoint
│   ├── src/
│   │   ├── components/
│   │   │   └── Chatbot.jsx   # Core Chatbot Component & Interface
│   │   ├── App.jsx           # Main App Wrapper
│   │   ├── main.jsx
│   │   └── index.css         # Styling Sheet
│   ├── index.html
│   ├── vercel.json           # Vercel Serverless Routing configurations
│   └── package.json
├── backend/                  # Local Backend (Express Server for offline run)
│   ├── server.js             # Local entrypoint (PORT 5000)
│   └── package.json
└── README.md                 # Project documentation
```

---

## 🚀 Local Installation & Setup

Follow these steps to run the chatbot locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/Tusharbunny06/University-Chat-Bot.git
cd University-Chat-Bot
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run the Backend (Local Node Server)
```bash
cd backend
npm install
npm start
```
The backend server will run on `http://localhost:5000`.

### 4. Run the Frontend (Vite App)
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173/`. Vite will automatically proxy `/api/*` requests to your local backend server running on port `5000`.

---

## ☁️ Deployment on Vercel

The project is structured to deploy to **Vercel** with zero-config serverless integration:

1. Connect your repository to **Vercel**.
2. Set the **Root Directory** settings in Vercel to `frontend`.
3. Add the following **Environment Variable** in Vercel Settings:
   * **Key**: `GROQ_API_KEY` (or `GEMINI_API_KEY`)
   * **Value**: Your Groq API key (`gsk_...`)
4. Click **Deploy**. Vercel will host the React client and spin up the Express router inside `/api/index.js` as an instant serverless function.

---


