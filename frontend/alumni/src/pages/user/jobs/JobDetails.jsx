import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'


export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [cv, setCv] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`)
      .then(res => setJob(res.data))
      .catch(err => toast.error('Failed to fetch job details'));
  }, [jobId]);

  const handleApply = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('message', message);
    formData.append('cv', cv);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/jobs/apply/${jobId}`, formData, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        title: "Application submitted!",
        icon: "success",
        draggable: true
      });
      
      setTimeout(() => {
        navigate('/jobs'); // الانتقال لصفحة الجوبس
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data.message === "You have already applied to this job.") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You have already applied!",
            footer: ' Cannot apply more than once.'
          });
    
        navigate('/jobs'); // الرجوع بعد الاشعار
      } else {
        toast.error('Failed to submit application');
      }
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <Container className="my-5">
      <h2  style={{color:'#A41A2F' }}>{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>published at :</strong> { new Date(job.createdAt).toLocaleString()}</p>
      <a href={job.applyLink} target="_blank" rel="noopener noreferrer">External Apply Link</a>

      <hr />

      <h4>Apply Now</h4>
      <Form onSubmit={handleApply}>
        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required  placeholder='05xx xxx xxx'/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={3} value={message} onChange={(e) => setMessage(e.target.value)}  placeholder='if you have any notes'/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Upload CV</Form.Label>
          <Form.Control type="file" onChange={(e) => setCv(e.target.files[0])} required />
        </Form.Group>
        <Button type="submit" style={{backgroundColor:'#A41A2F' , color:'white'}}>Apply Now</Button>
      </Form>
    </Container>
  );
}
