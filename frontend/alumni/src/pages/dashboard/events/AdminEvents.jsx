import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    description: "",
    date: "",
  });

  const token = localStorage.getItem("userToken");

  const navigate=useNavigate()
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`, {
        headers: { Authorization: `${token}` },
      });
      setEvents(res.data);
    } catch (error) {
      toast.error("❌ Failed to fetch events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/${id}`, {
        headers: { Authorization: `${token}` },
      });
      toast.success("🗑️ Event deleted");
      fetchEvents();
    } catch {
      toast.error("❌ Failed to delete event");
    }
  };

  const openEditModal = (event) => {
    setCurrentEvent(event);
    setShowEditModal(true);
  };
const handleCreateEvent = async () => {
  try {
    const formattedEvent = {
      ...newEvent,
      date: new Date(newEvent.date).toISOString(), // ✅ صيغة ISO
    };

    await axios.post(`${import.meta.env.VITE_API_URL}/api/events`, formattedEvent, {
      headers: { Authorization: `${token}` },
    });

    toast.success("🟢 Event added");
    setShowAddModal(false);
    setNewEvent({ title: "", location: "", description: "", date: "" });
    fetchEvents();
  } catch {
    toast.error("❌ Failed to add event");
  }
};

const handleUpdateEvent = async () => {
  try {
    const formattedEvent = {
      ...currentEvent,
      date: new Date(currentEvent.date).toISOString(), // ✅ صيغة ISO
    };

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/events/${currentEvent._id}`,
      formattedEvent,
      { headers: { Authorization: `${token}` } }
    );

    toast.success("✏️ Event updated");
    setShowEditModal(false);
    fetchEvents();
  } catch {
    toast.error("❌ Failed to update event");
  }
};



  return (
    <div className="p-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Events</h2>
        <Button onClick={() => setShowAddModal(true)}>Add Event</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.title}</td>
              <td>{event.location}</td>
              <td>{event.description}</td>
           <td>{event.date ? new Date(event.date).toLocaleDateString('en-GB') : 'No Date'}</td>


              <td>
        <Button
  variant="info"
  size="sm"
   className="me-2"
  onClick={() => navigate(`/admin/events/${event._id}/attendees`)}
>
  Attendees
</Button>

                <Button size="sm" onClick={() => openEditModal(event)} className="me-2" variant="warning">
                  Edit
                </Button>
                <Button size="sm" onClick={() => handleDeleteEvent(event._id)} variant="danger">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal: Add */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </Form.Group>
          <Form.Group className="mb-2">
  <Form.Label>Date</Form.Label>
  <Form.Control
    type="date"
    dir="ltr" // ✅ يجعل التاريخ من اليسار لليمين حتى مع اللغة العربية
    value={newEvent.date}
    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
    required
  />
</Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleCreateEvent}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Edit */}
      {showEditModal && currentEvent && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={currentEvent.title}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={currentEvent.location}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  value={currentEvent.description}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  dir="ltr" 
                  type="date"
                  value={currentEvent.date?.split('T')[0]}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="success" onClick={handleUpdateEvent}>Save</Button>
          </Modal.Footer>
        </Modal>
      )}

  
    </div>
  );
}
