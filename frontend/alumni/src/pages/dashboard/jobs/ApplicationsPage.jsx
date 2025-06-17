import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

export default function JobApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/applications/${jobId}`, {
          headers: { Authorization: `${token}` },
        });
        setApplications(res.data);

        // جلب بيانات الوظيفة
        const jobRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`, {
          headers: { Authorization: `${token}` },
        });
        setJobTitle(jobRes.data.title); // حفظ اسم الوظيفة
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, [jobId, token]);

  return (
    <Container className="my-4">
      <h2>Applicants for Job: <span className="text-primary">{jobTitle}</span></h2>
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        ← Back
      </Button>
      {applications.length === 0 ? (
        <p>No applications found for this job.</p>
      ) : (
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Applied At</th>
            <th>CV</th> {/* ✅ عمود جديد */}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td>{app.name}</td>
              <td>{app.applicant.email}</td>
              <td>{app.phone}</td>
              <td>{app.message}</td>
              <td>{new Date(app.appliedAt).toLocaleString()}</td>
              <td>
                {app.cv ? (
                  <a href={`http://localhost:8000/${app.cv}`} target="_blank" rel="noopener noreferrer">
                    📄 Download CV
                  </a>
                ) : (
                  'No CV'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      )}
    </Container>
  );
}
