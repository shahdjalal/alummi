import React, { useContext, useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown, Form, FormControl, Button, InputGroup } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import style from './navbar.module.css';
import { FaRocketchat, FaSearch } from "react-icons/fa";
import { CgProfile } from 'react-icons/cg';
import { CiLogout } from 'react-icons/ci';

export default function CustomNavbar() {
  const { user, setUser,isLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);


  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); 
 
 
  const handleScroll = () => {
    const offset = window.scrollY;
    setScrolled(offset > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;










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
   <Navbar expand="lg" className={`${style.nav} ${scrolled ? style.scrolled : ""} position-sticky top-0`}>
  <Container  className="d-flex justify-content-between align-items-center">

    {/* الشعار */}
    <Navbar.Brand as={Link} to="/">
      <img
        src="/tawasul.png"
        alt="Logo"
        width={80}
        height={80}
        style={{ cursor: 'pointer' }}
      />
    </Navbar.Brand>

    <Navbar.Toggle aria-controls="basic-navbar-nav" />
<Navbar.Collapse id="basic-navbar-nav" className="w-100">
  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center w-100 gap-3">

    {/* يسار: عنصر حجز مكان الشعار فقط */}
    <div className="d-none d-lg-block" style={{ width: "150px" }}></div>

    {/* ✅ المنتصف: الروابط */}
    <Nav className="d-flex flex-row justify-content-center align-items-center gap-3 flex-wrap">
      <Nav.Link as={Link} to="/" className={`${style.btn} ${isActive("/") ? style.active : ""}`}>Home</Nav.Link>
      <Nav.Link as={Link} to="/jobs" className={`${style.btn} ${isActive("/jobs") ? style.active : ""}`}>Jobs</Nav.Link>
      <Nav.Link as={Link} to="/groups" className={`${style.btn} ${isActive("/groups") ? style.active : ""}`}>Groups</Nav.Link>
       <Nav.Link as={Link} to="/events" className={`${style.btn} ${isActive("/events") ? style.active : ""}`}>Events</Nav.Link>
        {user?.role === 'admin' && (
              <Nav.Link as={Link} to="/admin/jobs" className={`${style.btn} ${isActive("/admin/jobs") ? style.active : ""}`}>
                Admin Panel
              </Nav.Link>
            )}
    
    
    </Nav>


    {/* ✅ يمين: البحث و Welcome */}
   {/* ✅ يمين: البحث و Welcome أو Sign In/Up */}
<div className="d-flex flex-column flex-lg-row align-items-center gap-2">

  {!user ? (
    <>
      <Nav.Link as={Link} to="/auth/login" className="text-white">Sign In</Nav.Link>
      <Nav.Link as={Link} to="/auth/register" className="text-white">Sign Up</Nav.Link>
    </>
  ) : (
    <>
      <Form className={`${style.search} w-100`}>
        <InputGroup>
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <FormControl
            type="search"
            placeholder="Search users..."
            value={query}
            onChange={handleSearch}
          />
        </InputGroup>
      </Form>

      <NavDropdown
        title={
          <span style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>
            Welcome {isLoading ? "...." : (user ? user.name : "Guest")}
          </span>
        }
        id="basic-nav-dropdown"
      >
        <NavDropdown.Item as={Link} to="/profile/info"><CgProfile /> Profile</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/chat"><FaRocketchat /> Chats</NavDropdown.Item>
        <NavDropdown.Item onClick={logout}><CiLogout/> Logout</NavDropdown.Item>
      </NavDropdown>
    </>
  )}
</div>


  </div>
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
