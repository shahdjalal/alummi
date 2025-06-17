import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, ListGroup, Image, Placeholder } from "react-bootstrap";
import { UserContext } from "../../../components/context/UserContext";
import { FaCircle } from "react-icons/fa";

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();
const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/conversations`, {
        headers: { Authorization: `${token}` },
      });
      setConversations(res.data);
          setIsLoading(false);
    } catch (err) {
      console.error("❌ Error fetching conversations", err);
    }
  };

  const getOtherUser = (c) => {
    return c.sender._id === user._id ? c.receiver : c.sender;
  };

   if (isLoading)   return (
      <>
        <Placeholder xs={6} />
        <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
      </>
    );

  return (
    <Container className="my-5">
      <h2 className="text-center m-4 text-bold" style={{ color: '#A41A2F' }}>My Conversations</h2>
      {conversations.length === 0 ? (
  <p className="text-muted mt-3">No conversations yet.</p>
) : (
    <ListGroup >
    {conversations.map((c) => {
      const otherUser = getOtherUser(c);
      const isUnread =
        c.lastMessage.receiver === user._id && !c.lastMessage.isRead;
  
      return (
        <ListGroup.Item style={{boxShadow:'5px 4px 10px #a41a2fa0'}}
          key={c.lastMessage._id}
          action
          onClick={() => navigate(`/chat/${otherUser._id}`)}
          className="d-flex align-items-center justify-content-between"
        >
          <div className="d-flex align-items-center" >
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
            <FaCircle />
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
