import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    applyLink: ''
  });

  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`, {
        headers: { Authorization: `${token}` },
      });
      setJobs(res.data); 
    } catch (error) {
      toast.error('❌ Failed to fetch jobs');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/jobs/delete/${jobId}`, {
        headers: { Authorization: `${token}` },
      });
      toast.success('🗑️ Job deleted');
      fetchJobs();
    } catch (error) {
      toast.error('❌ Failed to delete job');
    }
  };

  const openEditModal = (job) => {
    setCurrentJob(job);
    setShowEditModal(true);
  };

  const handleUpdateJob = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/jobs/edit/${currentJob._id}`,
        currentJob,
        { headers: { Authorization: `${token}` } }
      );
      toast.success('✏️ Job updated');
      setShowEditModal(false);
      fetchJobs();
    } catch (error) {
      toast.error('❌ Failed to update job');
    }
  };

  const handleCreateJob = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/jobs/add`, newJob, {
        headers: { Authorization: `${token}` },
      });
      toast.success('🟢 Job added');
      setShowAddModal(false);
      setNewJob({ title: '', company: '', location: '', description: '', applyLink: '' });
      fetchJobs();
    } catch (error) {
      toast.error('❌ Failed to add job');
    }
  };

  const handleViewApplications = (jobId) => {
    navigate(`/admin/jobs/${jobId}/applications`);
  };

  return (
    <Container fluid className="p-3">
      <ToastContainer />
      <Row className="justify-content-between align-items-center mb-4">
        <Col><h2 className="text-center text-md-start">Manage Jobs</h2></Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>➕ Add Job</Button>
        </Col>
      </Row>

      <div style={{ overflowX: 'auto' }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Description</th>
              <th>Apply Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td>{job.description}</td>
                <td>
                  <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                    Apply Here
                  </a>
                </td>
                <td>
                  <div className="d-flex flex-column flex-md-row">
                    <Button variant="info" size="sm" onClick={() => handleViewApplications(job._id)} className="me-md-2 mb-1 mb-md-0">Applications</Button>
                    <Button variant="warning" size="sm" onClick={() => openEditModal(job)} className="me-md-2 mb-1 mb-md-0">Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteJob(job._id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Edit Modal */}
      {showEditModal && currentJob && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Job</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {["title", "company", "location", "description", "applyLink"].map((field, i) => (
                <Form.Group className="mb-3" key={i}>
                  <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                  <Form.Control
                    as={field === "description" ? "textarea" : "input"}
                    rows={field === "description" ? 3 : undefined}
                    value={currentJob[field]}
                    onChange={(e) => setCurrentJob({ ...currentJob, [field]: e.target.value })}
                  />
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="success" onClick={handleUpdateJob}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["title", "company", "location", "description", "applyLink"].map((field, i) => (
              <Form.Group className="mb-3" key={i}>
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  as={field === "description" ? "textarea" : "input"}
                  rows={field === "description" ? 3 : undefined}
                  value={newJob[field]}
                  onChange={(e) => setNewJob({ ...newJob, [field]: e.target.value })}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleCreateJob}>Add Job</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
