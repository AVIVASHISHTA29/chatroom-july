import { format } from 'date-fns';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import './App.css';
import { db, storage } from './firebase';

function App() {
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [uploading, setUploading] = useState(false);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `${file.type.startsWith('image/') ? 'images' : 'audios'}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle progress
      },
      (error) => {
        console.error('File upload error:', error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await addDoc(collection(db, 'messages'), {
            fileUrl: downloadURL,
            fileType: file.type,
            sender: username,
            timestamp: new Date(),
          });
          setUploading(false);
        });
      }
    );
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
                {message.text && <div className="message-text">{message.text}</div>}
                {message.fileType?.startsWith('image/') && <img src={message.fileUrl} alt="uploaded" className="message-image" />}
                {message.fileType?.startsWith('audio/') && (
                  <audio controls>
                    <source src={message.fileUrl} type={message.fileType} />
                    Your browser does not support the audio element.
                  </audio>
                )}
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
          <div className="file-upload">
            <label htmlFor="file-input" className="file-upload-label">
              {uploading ? 'Uploading...' : 'Upload File'}
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*,audio/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
