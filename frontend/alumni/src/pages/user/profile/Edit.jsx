import React, { useContext, useState } from 'react';
import { Button, Form, Container, Card, Placeholder } from 'react-bootstrap';
import { UserContext } from '../../../components/context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Edit() {
  const { user, setUser,  isLoading,setSuccessToast } = useContext(UserContext); // ✅ أضفنا setSuccessToast
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

   if (isLoading) return  (
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
              <Placeholder xs={6} /> <Placeholder xs={8} />
            </Placeholder>
            <Placeholder.Button variant="danger" xs={6} />
          </Card.Body>
        </Card>
    );
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center p-3" style={{ minHeight: '80vh' }}>
        <Form 
    onSubmit={handleUpdate}
      encType="multipart/form-data"
      className="text-center p-4 border rounded shadow-lg bg-transparent w-100  mb-5 mt-3"
      style={{
        backdropFilter: "blur(10px)",
        maxWidth: "500px",   // أقصى عرض للبوكس
        borderColor: "#A41A2F"
      }}
    >
    
        <h1 className="mb-4" style={{ color: '#A41A2F' }}>Edit Profile</h1>

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

        <Button type="submit" disabled={isUpdating} className="w-100" style={{ backgroundColor: '#A41A2F', borderColor: "#A41A2F" }}>
          {isUpdating ? 'Updating...' : 'Save Changes'}
        </Button>
      </Form>
    </Container>
  );
}
