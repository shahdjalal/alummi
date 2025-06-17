import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Card, Form, Button, ListGroup } from "react-bootstrap";
import { UserContext } from "../../../components/context/UserContext";
import { FaPaperPlane } from "react-icons/fa";
import MessageLoading from "../../../components/loading/MessageLoading";

export default function GroupChat() {
  const { groupId } = useParams();
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("userToken");

  const [groupInfo, setGroupInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchGroupData();
    fetchMessages();
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchGroupData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/groups/${groupId}`, {
        headers: { Authorization: token },
      });
      setGroupInfo(res.data);
    } catch (err) {
      console.error("Error fetching group info", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/groups/${groupId}/messages`, {
        headers: { Authorization: token },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/groups/${groupId}/message`,
        { text: newMsg },
        {
          headers: { Authorization: token },
        }
      );

      const newMessage = {
        ...res.data,
        sender: {
          _id: user._id,
          name: user.name,
          profileImage: user.profileImage,
        },
      };

      setMessages([...messages, newMessage]);
      setNewMsg("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };


  if (isLoadingMessages) return <MessageLoading />;
  return (
    <Container className="p-3" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ color: '#A41A2F' }} className="text-center">
        💬 Group Chat – Batch {groupInfo?.batchYear}
      </h3>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '100px' }}>
        <Card className="p-3 mt-3" style={{ boxShadow: '0px 4px 6px #eee' }}>
          <ListGroup>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender._id === user._id ? 'flex-end' : 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    backgroundColor: msg.sender._id === user._id ? '#a41a2f4e' : '#F1F0F0',
                    padding: '10px 15px',
                    borderRadius: '20px',
                    maxWidth: '70%',
                    wordBreak: 'break-word',
                  }}
                >
                  <strong style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>
                    {msg.sender._id === user._id ? 'You' : msg.sender.name}
                  </strong>
                  <div>
                    {msg.text && <div>{msg.text}</div>}
                    {msg.file && (
                      <a href={msg.file} target="_blank" rel="noopener noreferrer">
                        <img
                          src={msg.file}
                          alt="attachment"
                          style={{
                            width: '100%',
                            maxWidth: '200px',
                            borderRadius: '10px',
                            marginTop: '5px',
                          }}
                        />
                      </a>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#555',
                      marginTop: '5px',
                      textAlign: 'right',
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
            {/* ✅ Scroll anchor */}
            <div ref={messagesEndRef}></div>
          </ListGroup>
        </Card>
      </div>

      {/* ✅ Input message box */}
      <Form
        className="mt-3 d-flex"
        encType="multipart/form-data"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '10px 15px',
          borderTop: '1px solid #ccc',
          zIndex: 1000,
        }}
      >
        <Container>
          <Form.Group className="d-flex gap-2 mb-0">
            <Form.Control
              placeholder="Type your message..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
            />
            <Button className="ms-2" style={{ backgroundColor: '#A41A2F' }} onClick={handleSend}>
              <FaPaperPlane />
            </Button>
          </Form.Group>
        </Container>
      </Form>
    </Container>
  );
}
