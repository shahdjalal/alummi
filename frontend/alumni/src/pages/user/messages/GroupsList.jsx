import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Container, Button, Card, Row, Col, Placeholder } from "react-bootstrap";
import { UserContext } from "../../../components/context/UserContext";
import { useNavigate } from "react-router-dom";
import { MdOutlineGroups2 } from "react-icons/md";

export default function GroupsList() {
  const [groups, setGroups] = useState([]);
  const [requestsSent, setRequestsSent] = useState([]);
  const token = localStorage.getItem("userToken");
  const { user } = useContext(UserContext);
const navigate = useNavigate();
const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/groups", {
        headers: { Authorization: `${token}` },
      });
      setGroups(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("❌ Error fetching groups", err);
    }
  };

  const requestJoin = async (batchYear) => {
    try {
      await axios.post(
        `http://localhost:8000/api/groups/request/${batchYear}`,
        {},
        { headers: { Authorization: `${token}` } }
      );
      setRequestsSent([...requestsSent, batchYear]);
    } catch (err) {
      console.error("❌ Error sending join request", err);
    }
  };

  // check if the current user is already a member
  const isMember = (group) =>
    user && group.members.some((member) => member._id === user._id);

  // check if the current user has a pending request
  const isPending = (group) =>
    user && group.pendingRequests.some((req) => req._id === user._id);

  if (isLoading)   return (
    <>
      <p aria-hidden="true">
        <Placeholder xs={6} />
      </p>

      <Placeholder.Button xs={4} variant="danger" aria-hidden="true" />
    </>
  );

  return (
    <Container className="my-5">
      <h1 style={{ color:'#A41A2F'}} className="text-center m-4"><MdOutlineGroups2 className="me-2"/> Available Groups</h1>
      <Row>
        {groups.map((group) => (
          <Col md={4} key={group._id}>
            <Card className="mb-3" style={{boxShadow:'0px 4px 6px #e35'}}>
              <Card.Body>
                <Card.Title>Batch {group.batchYear}</Card.Title>

              {isMember(group) ? (
  <>
    <Button variant="success" disabled className="me-2">
      ✅ Joined
    </Button>
    <Button
      style={{ backgroundColor:'#A41A2F'}}
      onClick={() => navigate(`/groups/chat/${group._id}`)}
    >
      Open Chat 💬
    </Button>
  </>
) : isPending(group) || requestsSent.includes(group.batchYear) ? (
  <Button variant="warning" disabled>
    ⏳ Request Pending
  </Button>
) : (
  <Button onClick={() => requestJoin(group.batchYear)}>
    Request to Join
  </Button>
)}
  
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
