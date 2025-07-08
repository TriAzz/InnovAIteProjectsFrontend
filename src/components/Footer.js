import React from 'react';
import { Container } from 'reactstrap';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="mb-0">&copy; 2025 InnovAIte Projects Dashboard. All rights reserved.</p>
          </div>
          <div>
            <img 
              src="/innovaite-logo-square.png" 
              alt="InnovAIte Logo" 
              style={{ height: '30px' }}
            />
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
