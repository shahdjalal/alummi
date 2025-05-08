import React, { useContext, useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { UserContext } from '../../../components/context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Edit() {
  const { user, setUser, setSuccessToast } = useContext(UserContext); // ✅ أضفنا setSuccessToast
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    skills: user?.skills?.join(', ') || '',
    jobTitle: user?.jobTitle || ''
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    const updatedSkills = formData.skills.split(',').map(skill => skill.trim());

    try {
      setIsUpdating(true);
      const response = await axios.put(
        'http://localhost:8000/api/auth/profile',
        {
          name: formData.name,
          skills: updatedSkills,
          jobTitle: formData.jobTitle
        },
        { headers: { Authorization: `${token}` } }
      );

      if (response.status === 200) {
        setUser(response.data.user);
        setSuccessToast(true); // ✅ بنحدد التوست للظهور بعد الرجوع
        navigate("/profile/info");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center p-3" style={{ minHeight: '80vh' }}>
      <Form onSubmit={handleUpdate}
        className="text-center p-4 border rounded shadow-lg bg-transparent"
        style={{ backdropFilter: "blur(10px)", maxWidth: "100%", width: "400px", borderColor: "#bc9c72" }}
      >
        <h1 className="mb-4" style={{ color: "#bc9c72" }}>Edit Profile</h1>

        <Form.Group controlId="formName" className="mb-3">
          <Form.Label className="fw-bold text-dark">Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label className="fw-bold text-dark">Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            disabled
          />
        </Form.Group>

        <Form.Group controlId="formSkills" className="mb-3">
          <Form.Label className="fw-bold text-dark">Skills (comma separated)</Form.Label>
          <Form.Control
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Example: React, Node.js, MongoDB"
          />
        </Form.Group>

        <Form.Group controlId="formJobTitle" className="mb-3">
          <Form.Label className="fw-bold text-dark">Job Title</Form.Label>
          <Form.Control
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Example: Front-End Developer"
          />
        </Form.Group>

        <Button type="submit" disabled={isUpdating} className="w-100" style={{ backgroundColor: "#bc9c72", borderColor: "#bc9c72" }}>
          {isUpdating ? 'Updating...' : 'Save Changes'}
        </Button>
      </Form>
    </Container>
  );
}
