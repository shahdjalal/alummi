import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, ListGroup, Image } from "react-bootstrap";
import { UserContext } from "../../components/context/UserContext";

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/messages/conversations", {
        headers: { Authorization: `${token}` },
      });
      setConversations(res.data);
    } catch (err) {
      console.error("❌ Error fetching conversations", err);
    }
  };

  const getOtherUser = (c) => {
    return c.sender._id === user._id ? c.receiver : c.sender;
  };

  return (
    <Container className="my-5">
      <h4>My Conversations</h4>
      {conversations.length === 0 ? (
  <p className="text-muted mt-3">No conversations yet.</p>
) : (
    <ListGroup>
    {conversations.map((c) => {
      const otherUser = getOtherUser(c);
      const isUnread =
        c.lastMessage.receiver === user._id && !c.lastMessage.isRead;
  
      return (
        <ListGroup.Item
          key={c.lastMessage._id}
          action
          onClick={() => navigate(`/chat/${otherUser._id}`)}
          className="d-flex align-items-center justify-content-between"
        >
          <div className="d-flex align-items-center">
            <Image
              src={
                otherUser.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  otherUser.name
                )}&background=A41A2F&color=fff`
              }
              roundedCircle
              width={40}
              height={40}
              className="me-2"
            />
            <div>
              <strong>{otherUser.name}</strong>
              <div style={{ fontSize: "0.85em", color: "#666" }}>
                {c.lastMessage.text}
              </div>
            </div>
          </div>
  
          {isUnread && (
            <span
              style={{
                backgroundColor: "red",
                color: "white",
                fontSize: "0.7em",
                padding: "3px 7px",
                borderRadius: "10px",
              }}
            >
              New
            </span>
          )}
        </ListGroup.Item>
      );
    })}
  </ListGroup>
  
)}
    </Container>
  );
}
