import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import tower from "../assets/tower.png";
import "./layout.css";

export default function Layout() {
  const [loginStatus, setLoginStatus] = useState(() => {
    const stored = sessionStorage.getItem("loginStatus");
    if (!stored) {
      return undefined;
    }
    try {
      return JSON.parse(stored);
    } catch (err) {
      sessionStorage.removeItem("loginStatus");
      return undefined;
    }
  });

  return (
    <div>
      <Navbar className="babel-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="babel-navbar__brand">
            <img src={tower} alt="logo og Babel (the Tatlin tower)" />
            BABEL
          </Navbar.Brand>
          <Nav className="nav-text">
            <Nav.Link as={Link} to="/">
              HOME
            </Nav.Link>
            <Nav.Link as={Link} to="How_to_use">
              HELP
            </Nav.Link>
            <Nav.Link as={Link} to="Translate" >
              TRANSLATE
            </Nav.Link>
            {loginStatus?.user ? (
              <Nav.Link as={Link} to="logout">
                LOGOUT
              </Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="login" >
                  LOGIN
                </Nav.Link>
                <Nav.Link as={Link} to="register" >
                  REGISTER
                </Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}
