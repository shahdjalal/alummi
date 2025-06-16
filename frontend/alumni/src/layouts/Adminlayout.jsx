import React from "react";
import { Outlet } from "react-router-dom";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";

export default function Adminlayout() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand href="/">Admin Panel</Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-navbar-nav" />
          <Navbar.Collapse id="admin-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/admin/jobs">Jobs</Nav.Link>
               <Nav.Link href="/admin/events">Events</Nav.Link>
              <Nav.Link href="/admin/groups">Manage Groups</Nav.Link>
              <Nav.Link href="/">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  );
}
