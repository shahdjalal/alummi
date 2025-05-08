import React, { useContext, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import style from './navbar.module.css';

export default function CustomNavbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userToken");
    navigate('/auth/login');
  };

  // Handle search
  const handleSearch = async (e) => {
    const q = e.target.value;
    setQuery(q);

    if (!q.trim()) {
      setResults([]);
      setShowModal(false);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8000/api/users/search?q=${q}`, {
        headers: { Authorization: token },
      });
      setResults(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("❌ Search failed", err);
    }
  };

  return (
    <>
      <Navbar expand="lg" className={`${style.nav}`}>
        <Container>
          <Navbar.Brand as={Link} to="/">Alumni System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/jobs">Jobs</Nav.Link>
              {!user ? (
  <>
    <Nav.Link as={Link} to={'/auth/login'}>Sign In</Nav.Link>
    <Nav.Link as={Link} to={'/auth/register'}>Sign Up</Nav.Link>
  </>
) : (
  <>
    {/* أزرار لما يكون مسجل دخول */}
    <Nav.Link as={Link} to={'/'}>Home</Nav.Link>
    <Nav.Link as={Link} to={'/jobs'}>Jobs</Nav.Link>
    {/* وزر البحث وProfile و Logout ... إلخ */}
  </>
)}

              {user && (
                <>
                  <Form className="d-flex mx-2">
                    <FormControl
                      type="search"
                      placeholder="Search users..."
                      className="me-2"
                      value={query}
                      onChange={handleSearch}
                    />
                  </Form>

                  <NavDropdown title="Menu" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/profile/info">Profile</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/chat">Chat</NavDropdown.Item>
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🔍 Modal لعرض نتائج البحث */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Search Results</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {results.length > 0 ? (
                  results.map((u) => (
                    <div
                      key={u._id}
                      className="d-flex align-items-center p-2 border-bottom"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate(`/profile/${u._id}`);
                        setShowModal(false);
                        setQuery('');
                      }}
                    >
                      <img
                        src={u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`}
                        alt={u.name}
                        width="40"
                        height="40"
                        className="rounded-circle me-2"
                        style={{ objectFit: "cover" }}
                      />
                      <div>
                        <strong>{u.name}</strong>
                        <p className="m-0 text-muted" style={{ fontSize: '14px' }}>{u.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No users found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
