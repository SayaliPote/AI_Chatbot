import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Auth from "./Auth.jsx";
import {MyContext} from "./MyContext.jsx";
import { useAuth } from "./authState.js";
import { useState } from 'react';
import {v1 as uuidv1} from "uuid";

// the chat screen: only mounted when a user is logged in
function ChatApp() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  return (
    <MyContext.Provider value={providerValues}>
      <Sidebar></Sidebar>
      <ChatWindow></ChatWindow>
    </MyContext.Provider>
  )
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className='app'></div>;
  }

  return (
    <div className='app'>
      {/* key={user.id}: logging in as someone else starts with fresh state */}
      {user ? <ChatApp key={user.id} /> : <Auth />}
    </div>
  )
}

export default App
