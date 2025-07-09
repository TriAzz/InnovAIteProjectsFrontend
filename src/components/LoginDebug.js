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
        response = await axios.get(`${apiUrl}/health`);
        setResult(response.data);
      }
      
      // Create admin user
      else if (action === 'createAdmin') {
        response = await axios.post(`${apiUrl}/users/setup-admin`, {
          email,
          password,
          firstName: 'Admin',
          lastName: 'User',
          description: 'Created for debugging'
        });
        setResult(response.data);
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
      setError(`Error: ${err.response?.status} ${err.response?.statusText} - ${err.message}`);
      if (err.response?.data) {
        setResult(err.response.data);
      }
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
