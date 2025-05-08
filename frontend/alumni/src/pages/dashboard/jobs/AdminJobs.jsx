import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form } from 'react-bootstrap';
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
      const res = await axios.get('http://localhost:8000/api/jobs', {
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
      await axios.delete(`http://localhost:8000/api/jobs/delete/${jobId}`, {
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
        `http://localhost:8000/api/jobs/edit/${currentJob._id}`,
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
      await axios.post('http://localhost:8000/api/jobs/add', newJob, {
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
    <div className="p-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Jobs</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Job</Button>
      </div>

      <Table striped bordered hover>
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
                <Button variant="info" size="sm" onClick={() => handleViewApplications(job._id)} className="me-2">Applications</Button>
                <Button variant="warning" size="sm" onClick={() => openEditModal(job)} className="me-2">Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteJob(job._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 🟡 Modal للتعديل */}
      {showEditModal && currentJob && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Job</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={currentJob.title}
                  onChange={(e) => setCurrentJob({ ...currentJob, title: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Control
                  type="text"
                  value={currentJob.company}
                  onChange={(e) => setCurrentJob({ ...currentJob, company: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={currentJob.location}
                  onChange={(e) => setCurrentJob({ ...currentJob, location: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={currentJob.description}
                  onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Apply Link</Form.Label>
                <Form.Control
                  type="text"
                  value={currentJob.applyLink}
                  onChange={(e) => setCurrentJob({ ...currentJob, applyLink: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="success" onClick={handleUpdateJob}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* 🟢 Modal لإضافة وظيفة */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                value={newJob.company}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apply Link</Form.Label>
              <Form.Control
                type="text"
                value={newJob.applyLink}
                onChange={(e) => setNewJob({ ...newJob, applyLink: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleCreateJob}>Add Job</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
