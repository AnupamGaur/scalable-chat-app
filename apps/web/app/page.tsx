"use client"
import React, { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function Home() {
  const {sendMessage,messages} = useSocket(); 
  const [message,setMessage] = useState('')
  // console.log(message)
  return (
<>
<div>
  <input type="text" placeholder="Your Message..." onChange={(e) => setMessage(e.target.value)}/>
  
  <button onClick={() => sendMessage(message)}> Send </button>
</div>
<div>
  <ul>
    {
      messages.map(msg => <li>{msg}</li>)
    }
  </ul>
  <h1>Welcome to the chat app!</h1>
  <p>This is a simple chat app using React, Socket.io, and Redis.</p>
  <p>Type your messages and click "Send" to send them to all connected clients.</p>
  <p>Messages will be displayed in real-time.</p>
  <p>To test this, open multiple browser tabs and send messages from one tab. You should see the messages displayed in all tabs.</p>
  <p>Note: This is a basic example and does not include user authentication or any other features you might expect in a real-world application.</p>
</div>
</>
  );
}
