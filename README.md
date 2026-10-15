SigmaGPT – AI Chatbot

SigmaGPT is a full-stack AI chatbot built using React, Node.js, Express.js, MongoDB Atlas, and the Google Gemini API. I developed this project during my Full Stack Web Development internship at YHills.

Live Demo: https://ai-chatbot-omega-fawn.vercel.app

The backend runs on Render's free plan, so the first request after a period of inactivity may take 30–60 seconds while the server wakes up.

Features
User signup and login with JWT authentication
Chat with AI using the Google Gemini API
Save conversations in MongoDB Atlas, separately for each user
View previous chats from the sidebar
Start new chats and delete existing ones
Display AI responses in Markdown format
Highlight code in responses
Show a typing animation while displaying responses
Handle temporary API errors with model fallback and retry
Technologies Used
Frontend: React, Vite, JavaScript
Backend: Node.js, Express.js
Database: MongoDB Atlas, Mongoose
Authentication: JSON Web Tokens (JWT), bcryptjs
AI API: Google Gemini API
Other Libraries: React Markdown, Highlight.js, UUID, dotenv
Deployment: Vercel (frontend), Render (backend), MongoDB Atlas (database)
How It Works
The user signs up or logs in and receives a JWT token.
The user enters a message in the chat window.
The frontend sends the message to the backend along with the token.
The backend sends the request to the Gemini API.
The response and conversation are saved in MongoDB Atlas.
The response is displayed in the chat window, and previous conversations can be accessed from the sidebar.
Project Structure
text
AI_Chatbot/
├── Backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── Frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── screenshots/
│   ├── chat.png
│   ├── code-reply.png
│   ├── database.png
│   └── history.png
├── .gitignore
└── README.md
Getting Started
Prerequisites
Node.js and npm
MongoDB Atlas account
Google Gemini API key
1. Clone the Repository
bash
git clone https://github.com/SayaliPote/AI_Chatbot.git
cd AI_Chatbot
2. Run the Backend
bash
cd Backend
npm install

Create a .env file inside the Backend folder and add your own credentials:

env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=any_long_random_string

Start the backend:

bash
npm start

The server runs on http://localhost:8080.

3. Run the Frontend

Open another terminal and run:

bash
cd Frontend
npm install
npm run dev

Open the local URL provided by Vite in your browser.

Deployment

The project is deployed as three separate parts:

Part	Platform	Notes
Frontend	Vercel	Root directory: Frontend. Environment variable: VITE_API_URL (the backend URL)
Backend	Render	Root directory: Backend. Build: npm install, Start: npm start
Database	MongoDB Atlas	Network access set to allow connections from Render

Backend environment variables on Render: MONGODB_URI, GEMINI_API_KEY, JWT_SECRET.

Screenshots
Chat	Code Reply
Show Image	Show Image
History	Database
Show Image	Show Image
Future Improvements
Improve chat response streaming
Enhance the interface for mobile devices
Restrict CORS to the deployed frontend URL
