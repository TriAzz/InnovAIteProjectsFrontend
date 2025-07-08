import React, { useState } from 'react';
import { 
  Navbar, 
  Nav, 
  NavItem, 
  NavLink as ReactstrapNavLink, 
  Container, 
  Button,
  Collapse,
  NavbarToggler,
  NavbarBrand
} from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar className="header" expand="md" dark>
      <Container>
        <NavbarBrand tag={Link} to="/" className="d-flex align-items-center">
          <img 
            src="/innovaite-logo-square.png" 
            alt="InnovAIte Logo" 
            className="logo"
          />
          InnovAIte Projects Dashboard
        </NavbarBrand>
        
        <NavbarToggler onClick={toggle} />
        
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <NavItem>
              <ReactstrapNavLink tag={Link} to="/">
                Home
              </ReactstrapNavLink>
            </NavItem>
            <NavItem>
              <ReactstrapNavLink tag={Link} to="/projects">
                Projects
              </ReactstrapNavLink>
            </NavItem>
            
            {user ? (
              <>
                <NavItem>
                  <ReactstrapNavLink tag={Link} to="/create-project">
                    Create Project
                  </ReactstrapNavLink>
                </NavItem>
                <NavItem>
                  <ReactstrapNavLink tag={Link} to="/profile">
                    Profile
                  </ReactstrapNavLink>
                </NavItem>
                <NavItem>
                  <Button 
                    color="outline-light" 
                    size="sm" 
                    className="ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <ReactstrapNavLink tag={Link} to="/login">
                    Login
                  </ReactstrapNavLink>
                </NavItem>
                <NavItem>
                  <ReactstrapNavLink tag={Link} to="/register">
                    Register
                  </ReactstrapNavLink>
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
