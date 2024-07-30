import { format } from 'date-fns';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import './App.css';
import { db } from './firebase';

function App() {
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'users'), { name: username });
    setIsUsernameSet(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      sender: username,
      timestamp: new Date(),
    });

    setNewMessage('');
  };

  return (
    <div className="App">
      {!isUsernameSet ? (
        <div className="popup">
          <form onSubmit={handleUsernameSubmit}>
            <label>
              Enter your name:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <div className="chat-window">
          <div className="header">
            <h2>Chat App</h2>
            <span>{username}</span>
          </div>
          <div className="messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === username ? 'sender' : 'receiver'}`}
              >
                <div className="message-header">
                  <span className="message-sender">{message.sender}</span>
                  <span className="message-time">{format(new Date(message.timestamp.seconds * 1000), 'p, MMM dd')}</span>
                </div>
                <div className="message-text">{message.text}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              required
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
