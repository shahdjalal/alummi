import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Form, Row, Col, Button, Placeholder } from 'react-bootstrap';
import { toast } from 'react-toastify';
import style from './job.module.css';
import { FaBriefcase } from 'react-icons/fa';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/jobs');
        setJobs(res.data);
        setIsLoading(false);
      } catch (error) {
        toast.error('❌ Failed to fetch jobs');
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
     job.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (locationFilter === '' || job.location === locationFilter) &&
    (companyFilter === '' || job.company === companyFilter)
  );

  const uniqueLocations = [...new Set(jobs.map(job => job.location))];
  const uniqueCompanies = [...new Set(jobs.map(job => job.company))];

  if (isLoading) {
    return (
      <Container className="my-5">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="mb-3">
            <Placeholder as="p" animation="wave">
              <Placeholder xs={8} /> <Placeholder xs={6} /> <Placeholder xs={4} />
            </Placeholder>
          </div>
        ))}
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="mb-4 text-center" style={{ color: '#A41A2F' }}> <FaBriefcase className="me-2" /> Available Jobs</h1>

      {/* فلاتر استجابة للشاشات */}
      <Form className="mb-4">
        <Row className="gy-2">
          <Col xs={12} md={4}>
            <Form.Control
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="">All Locations</option>
              {uniqueLocations.map((loc, index) => (
                <option key={index} value={loc}>{loc}</option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} md={4}>
            <Form.Select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
              <option value="">All Companies</option>
              {uniqueCompanies.map((comp, index) => (
                <option key={index} value={comp}>{comp}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* جدول الوظائف داخل Scrollable Wrapper */}
      <div style={{ overflowX: 'auto' }}>
        <Table responsive hover className="table-bordered">
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
                  <Button
                    href={`/jobs/${job._id}`}
                    style={{ backgroundColor: '#A41A2F', color: 'white', border: 'none' }}
                    size="sm"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}
