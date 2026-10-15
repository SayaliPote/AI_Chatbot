# SigmaGPT – AI Chatbot

SigmaGPT is an AI chatbot built using React, Node.js, Express.js, MongoDB Atlas, and the Google Gemini API. I developed this project during my Full Stack Web Development internship at YHills.

## Features

- Chat with AI using the Google Gemini API
- Save conversations in MongoDB Atlas
- View previous chats from the sidebar
- Start new chats and delete existing ones
- Display AI responses in Markdown format
- Highlight code in responses
- Show a typing animation while displaying responses
- Handle temporary API errors with model fallback and retry

## Technologies Used

- **Frontend:** React, Vite, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **AI API:** Google Gemini API
- **Other Libraries:** React Markdown, Highlight.js, UUID, dotenv

## How It Works

1. The user enters a message in the chat window.
2. The frontend sends the message to the backend.
3. The backend sends the request to the Gemini API.
4. The response and conversation are saved in MongoDB Atlas.
5. The response is displayed in the chat window, and previous conversations can be accessed from the sidebar.

## Project Structure

```text
SigmaGPT/
├── Backend/
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
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/SayaliPote/AI_Chatbot.git
cd SigmaGPT
```

### 2. Run the Backend

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder and add your own credentials:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend using the command configured in your `Backend/package.json`.

### 3. Run the Frontend

Open another terminal and run:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL provided by Vite in your browser.

## Future Improvements

- Add user authentication
- Improve chat response streaming
- Enhance the interface for mobile devices
