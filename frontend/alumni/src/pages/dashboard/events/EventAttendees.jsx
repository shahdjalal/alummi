// src/pages/dashboard/events/EventAttendees.jsx
import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function EventAttendees() {
  const [attendees, setAttendees] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const { id } = useParams();
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events/${id}`, {
          headers: { Authorization: token },
        });
        setAttendees(res.data.attendees);
        setEventTitle(res.data.title);
      } catch (error) {
        toast.error("❌ Failed to load attendees");
      }
    };

    fetchAttendees();
  }, [id, token]);

  return (
    <Container className="my-5">
      <ToastContainer />
      <h2 className="mb-4">🎫 Attendees for: {eventTitle}</h2>
      
      <Button onClick={() => navigate(-1)} variant="secondary" className="mb-3">← Back</Button>
<h5>Total Attendees: {attendees.length}</h5>
      {attendees.length === 0 ? (
        <p className="text-muted">No attendees yet.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
