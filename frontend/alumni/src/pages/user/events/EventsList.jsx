import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Spinner, Placeholder } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`);
        setEvents(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch events");
      }
    };

    fetchEvents();
  }, []);

 if (isLoading) {
    return (
      <Container className="my-5">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="mb-3">
            <Placeholder as="p" animation="wave">
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
      <h2 className="mb-4 text-center">📅 Upcoming Events</h2>
      {events.map((event) => (
        <Card key={event._id} className="mb-3">
          <Card.Body>
            <Card.Title>{event.title}</Card.Title>
            <Card.Text>{event.description}</Card.Text>
            <Card.Text><strong>Date:</strong> {new Date(event.date).toLocaleString()}</Card.Text>
            <Button as={Link} to={`/events/${event._id}`} variant="danger">View Details</Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
