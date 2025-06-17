import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert, Placeholder } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events/${eventId}`, {
          headers: { Authorization: `${token}` },
        });

        setEvent(res.data);

        // ✅ التحقق إذا كان المستخدم ضمن قائمة الحضور
        const userToken = localStorage.getItem("userToken");
        const decoded = JSON.parse(atob(userToken.split(".")[1]));
        const userId = decoded.id;

        const registered = res.data.attendees.some((attendee) => attendee._id === userId);
        setIsRegistered(registered);
        setIsLoading(false);
      } catch (err) {
        toast.error("❌ Failed to load event details");
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, token]);

  const handleRegister = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/events/register/${eventId}`,
        {},
        { headers: { Authorization: `${token}` } }
      );
      toast.success("✅ Registered successfully!");
      setIsRegistered(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to register");
    }
  };

if (isLoading) {
    return (
      <Container className="my-5">
        {[...Array(1)].map((_, index) => (
          <div key={index} className="mb-3">
            <Placeholder as="p" animation="wave">
              <Placeholder xs={8} /> <Placeholder xs={6} /> <Placeholder xs={4} />
               <Placeholder xs={8} /> <Placeholder xs={6} /> <Placeholder xs={4} />
                <Placeholder xs={8} /> <Placeholder xs={6} /> <Placeholder xs={4} />
               <Placeholder.Button xs={4} variant="danger" aria-hidden="true" />
            </Placeholder>
          </div>
        ))}
      </Container>
    );
  }
  return (
    <Container className="my-5">
      <ToastContainer />
      <Card>
        <Card.Body>
          <Card.Title>{event.title}</Card.Title>
          <Card.Text>{event.description}</Card.Text>
          <Card.Text><strong>Date:</strong> {new Date(event.date).toLocaleDateString("en-GB")}</Card.Text>
          <Card.Text><strong>Location:</strong> {event.location}</Card.Text>

          {isRegistered ? (
            <Alert variant="success" className="mt-3">
              🎉 You are already registered for this event!
            </Alert>
          ) : (
            <Button variant="danger" className="mt-3" onClick={handleRegister}>
              Register for Event
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
