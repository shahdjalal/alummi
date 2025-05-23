import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { UserContext } from '../../components/context/UserContext';
import { useRef } from 'react';

export default function Chat() {
  const { userId } = useParams(); // مين بتكلمي
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const token = localStorage.getItem('userToken');
 const { user } = useContext(UserContext); // 🟢 نستخدم الكونتكست
 const [receiver, setReceiver] = useState(null);
 const [selectedFile, setSelectedFile] = useState(null);
 const messagesEndRef = useRef(null);

 const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
  scrollToBottom();
}, [messages]);

 useEffect(() => {
    fetchMessages();
    fetchReceiver(); // 🟢 نجيب بياناته كمان
  }, [userId]);
  
  const fetchReceiver = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/users/user/${userId}`, {
        headers: { Authorization: `${token}` },
      });
      setReceiver(res.data.user);
    } catch (error) {
      console.error("❌ Failed to fetch receiver info");
    }
  };
  

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/messages/${userId}`, {
        headers: { Authorization: `${token}` },
      });
      setMessages(res.data);
    } catch (error) {
      console.error('❌ Failed to fetch messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", newMessage);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    formData.append("receiverId", userId);
  
    try {
      const res = await axios.post("http://localhost:8000/api/messages/send", formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      setMessages([...messages, res.data]); // رسالة جديدة من السيرفر
      setNewMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.error("❌ Failed to send message");
    }
  };
  

  if (!user) return <p>Loading...</p>;


  return (
    <Container fluid className="p-3" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h4>Chat with: {receiver ? receiver.name : userId}</h4>
  
      {/* الرسائل داخل صندوق قابل للتمرير */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '100px' }}>
        <ListGroup>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: msg.sender === user._id ? 'flex-end' : 'flex-start',
                marginBottom: '10px'
              }}
            >
              <div
                style={{
                  backgroundColor: msg.sender === user._id ? '#DCF8C6' : '#F1F0F0',
                  padding: '10px 15px',
                  borderRadius: '20px',
                  maxWidth: '70%',
                  wordBreak: 'break-word'
                }}
              >
                <strong style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>
                  {msg.sender === userId ? receiver?.name : 'You'}
                </strong>
                <div>
                  {msg.text && <div>{msg.text}</div>}
                  {msg.file && (
                    <a href={msg.file} target="_blank" rel="noopener noreferrer">
                      <img
                        src={msg.file}
                        alt="attachment"
                        style={{ width: '100%', maxWidth: '200px', borderRadius: '10px', marginTop: '5px', cursor: 'pointer' }}
                      />
                    </a>
                  )}
                </div>
                {msg.createdAt && (
                  <div style={{ fontSize: '11px', color: '#555', marginTop: '5px', textAlign: 'right' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />  </div>
          ))}
        </ListGroup>
      </div>
  
      {/* 🟢 فورم ثابت أسفل الشاشة */}
      <Form
        onSubmit={handleSendMessage}
        encType="multipart/form-data"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '10px 15px',
          borderTop: '1px solid #ccc',
          zIndex: 1000
        }}
      >
        <Container>
          <Form.Group className="d-flex gap-2 mb-0">
            <Form.Control
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ maxWidth: '180px' }}
            />
            <Button type="submit" variant="primary">
              Send
            </Button>
          </Form.Group>
        </Container>
      </Form>
    </Container>
  );
  
}
