import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';

const AdminSetup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkIfAdminExists();
  }, []);

  const checkIfAdminExists = async () => {
    try {
      // Try to get all users to see if any exist
      const response = await usersAPI.getAll();
      if (response.data && response.data.length > 0) {
        setAdminExists(true);
      }
    } catch (error) {
      // If we get an error, it might mean no users exist yet, which is what we want
      console.log('No users exist yet, admin setup can proceed');
    } finally {
      setCheckingAdmin(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await usersAPI.setupAdmin({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        description: formData.description
      });

      if (response.data) {
        navigate('/login', { 
          state: { 
            message: 'Admin account created successfully! You can now log in with your credentials.' 
          } 
        });
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      if (error.response?.status === 409) {
        setError('Admin user already exists. Please use the regular login page.');
        setAdminExists(true);
      } else {
        setError(error.response?.data?.message || 'Failed to create admin account');
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Checking system status...</span>
          </div>
          <p className="mt-2">Checking system status...</p>
        </div>
      </Container>
    );
  }

  if (adminExists) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md="8" lg="6">
            <Card>
              <CardBody className="text-center p-5">
                <div className="mb-4">
                  <img 
                    src="/innovaite-logo-square.png" 
                    alt="InnovAIte Logo" 
                    style={{ height: '80px', marginBottom: '20px' }}
                  />
                  <h3>System Already Configured</h3>
                </div>
                <Alert color="info">
                  <h5>Admin account already exists!</h5>
                  <p className="mb-0">
                    The InnovAIte Projects Dashboard has already been set up. 
                    Please use the regular login page to access your account.
                  </p>
                </Alert>
                <div className="mt-4">
                  <Button color="primary" onClick={() => navigate('/login')} className="me-3">
                    Go to Login
                  </Button>
                  <Button color="outline-primary" onClick={() => navigate('/')}>
                    Back to Home
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md="8" lg="6">
          <Card>
            <CardBody className="p-4">
              <div className="text-center mb-4">
                <img 
                  src="/innovaite-logo-square.png" 
                  alt="InnovAIte Logo" 
                  style={{ height: '80px', marginBottom: '20px' }}
                />
                <CardTitle tag="h3">Setup InnovAIte Admin</CardTitle>
                <p className="text-muted">
                  Welcome! This appears to be the first time accessing the InnovAIte Projects Dashboard. 
                  Please create the initial administrator account to get started.
                </p>
              </div>

              {error && (
                <Alert color="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="firstName">First Name *</Label>
                      <Input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="Enter first name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="lastName">Last Name *</Label>
                      <Input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Enter last name"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="email">Admin Email Address *</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter admin email"
                  />
                </FormGroup>

                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="password">Password *</Label>
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter password (min 6 chars)"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="confirmPassword">Confirm Password *</Label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm password"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="description">Description (Optional)</Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Brief description about yourself or your role..."
                  />
                </FormGroup>

                <Alert color="warning" className="mt-3">
                  <strong>Important:</strong> This admin account will have full access to manage users, 
                  projects, and comments. Please choose a strong password and keep these credentials secure.
                </Alert>

                <Button 
                  type="submit" 
                  color="primary" 
                  size="lg" 
                  block 
                  disabled={loading}
                  className="mt-3"
                >
                  {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminSetup;
