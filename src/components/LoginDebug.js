import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Input } from 'reactstrap';
import axios from 'axios';

const LoginDebug = () => {
  const [action, setAction] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiUrl, setApiUrl] = useState('https://innovaiteprojectsbackend.onrender.com/api');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      let response;
      
      // Test connection to API
      if (action === 'testApi') {
        // Try multiple health endpoints
        const results = {};
        
        try {
          // Try the simple health endpoint that doesn't require DB connection
          const simpleResponse = await axios.get(`${apiUrl.replace('/api', '')}/health`);
          results.simpleHealth = simpleResponse.data;
        } catch (error) {
          results.simpleHealthError = error.message;
        }
        
        try {
          // Try the public setup health endpoint
          const publicSetupResponse = await axios.get(`${apiUrl.replace('/api', '')}/api/public-setup/health`);
          results.publicSetupHealth = publicSetupResponse.data;
        } catch (error) {
          results.publicSetupHealthError = error.message;
        }
        
        try {
          // Try the main API health endpoint
          const apiHealthResponse = await axios.get(`${apiUrl}/health`);
          results.apiHealth = apiHealthResponse.data;
        } catch (error) {
          results.apiHealthError = error.message;
        }
        
        setResult({
          message: "Health check results",
          ...results
        });
      }
      
      // Create admin user
      else if (action === 'createAdmin') {
        try {
          // Try setup-admin endpoint first
          response = await axios.post(`${apiUrl}/users/setup-admin`, {
            email,
            password,
            firstName: 'Admin',
            lastName: 'User',
            description: 'Created for debugging'
          });
          setResult({
            adminCreationMethod: "setup-admin endpoint",
            response: response.data
          });
        } catch (setupError) {
          // If that fails, try the setup controller endpoint
          try {
            response = await axios.post(`${apiUrl}/setup/first-admin`, {
              email,
              password,
              firstName: 'Admin',
              lastName: 'User',
              description: 'Created for debugging'
            });
            setResult({
              adminCreationMethod: "setup/first-admin endpoint",
              response: response.data
            });
          } catch (setupControllerError) {
            // If that fails, try the new public setup endpoint
            try {
              response = await axios.post(`${apiUrl.replace('/api', '')}/api/public-setup/first-admin`, {
                email,
                password,
                firstName: 'Admin',
                lastName: 'User',
                description: 'Created for debugging'
              });
              setResult({
                adminCreationMethod: "public-setup/first-admin endpoint",
                response: response.data
              });
            } catch (publicSetupError) {
              throw new Error(`All admin creation methods failed. Errors: 
                1. Setup-admin: ${setupError.message}
                2. Setup/first-admin: ${setupControllerError.message}
                3. Public-setup/first-admin: ${publicSetupError.message}`);
            }
          }
        }
      }
      
      // Test login
      else if (action === 'testLogin') {
        const credentials = btoa(`${email}:${password}`);
        response = await axios.get(`${apiUrl}/users/me`, {
          headers: {
            'Authorization': `Basic ${credentials}`
          }
        });
        setResult(response.data);
      }
      
    } catch (err) {
      const errorDetails = {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.response?.config?.url
      };
      
      setError(`Error: ${err.response?.status || 'Network'} ${err.response?.statusText || ''} - ${err.message}`);
      if (err.response?.data) {
        errorDetails.responseData = err.response.data;
      }
      setResult(errorDetails);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="mt-5">
      <h1>Login Debug Tool</h1>
      <Row>
        <Col md={6}>
          <Card className="p-4 mb-4">
            <h3>API Settings</h3>
            <Form>
              <div className="mb-3">
                <label>API URL</label>
                <Input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="d-flex gap-2">
                <Button 
                  color="info" 
                  onClick={(e) => {
                    setAction('testApi');
                    handleAction(e);
                  }}
                  disabled={loading}
                >
                  Test API Connection
                </Button>
                <Button 
                  color="warning" 
                  onClick={(e) => {
                    setAction('createAdmin');
                    handleAction(e);
                  }}
                  disabled={loading}
                >
                  Create Admin User
                </Button>
                <Button 
                  color="primary" 
                  onClick={(e) => {
                    setAction('testLogin');
                    handleAction(e);
                  }}
                  disabled={loading}
                >
                  Test Login
                </Button>
              </div>
            </Form>
          </Card>
          
          {loading && <Alert color="info">Loading...</Alert>}
          {error && <Alert color="danger">{error}</Alert>}
        </Col>
        
        <Col md={6}>
          <Card className="p-4">
            <h3>Results</h3>
            <pre className="bg-light p-3 rounded" style={{ maxHeight: '400px', overflow: 'auto' }}>
              {result ? JSON.stringify(result, null, 2) : 'No results yet'}
            </pre>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginDebug;
