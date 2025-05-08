import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Form, Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/jobs');
        setJobs(res.data);
      } catch (error) {
        toast.error('❌ Failed to fetch jobs');
      }
    };

    fetchJobs();
  }, []);

  // 🟢 فلترة الوظائف
  const filteredJobs = jobs.filter(job =>
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
     job.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (locationFilter === '' || job.location === locationFilter) &&
    (companyFilter === '' || job.company === companyFilter)
  );

  // 🟢 المواقع والشركات المميزة
  const uniqueLocations = [...new Set(jobs.map(job => job.location))];
  const uniqueCompanies = [...new Set(jobs.map(job => job.company))];

  return (
    <Container className="my-5">
      <h2 className="mb-4">Available Jobs</h2>

      {/* 🔍 الفلاتر جنب بعض */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
            <option value="">All Locations</option>
            {uniqueLocations.map((loc, index) => (
              <option key={index} value={loc}>{loc}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
            <option value="">All Companies</option>
            {uniqueCompanies.map((comp, index) => (
              <option key={index} value={comp}>{comp}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* 🔥 جدول الوظائف */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job) => (
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.company}</td>
              <td>{job.location}</td>
              <td>
                <Button variant="info" href={`/jobs/${job._id}`}>View Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
