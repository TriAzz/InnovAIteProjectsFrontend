import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gitHubUrl: '',
    liveSiteUrl: '',
    status: 'Not Started',
    tools: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    setLoading(true);

    try {
      const response = await projectsAPI.create(formData);
      
      if (response.data) {
        navigate(`/projects/${response.data.id}`, {
          state: { message: 'Project created successfully!' }
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.response?.data?.message || error.response?.data || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md="8" className="text-center">
            <Alert color="warning">
              <h4>Authentication Required</h4>
              <p>You need to be logged in to create a project.</p>
              <Button color="primary" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </Alert>
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
                <CardTitle tag="h3">Create New Project</CardTitle>
                <p className="text-muted">Share your innovative project with the InnovAIte community</p>
              </div>

              {error && (
                <Alert color="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="title">Project Title *</Label>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter your project title"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="description">Project Description *</Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Describe your project, its purpose, features, and any other relevant details..."
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="status">Project Status *</Label>
                  <Input
                    type="select"
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="tools">Tools & Technologies</Label>
                  <Input
                    type="text"
                    name="tools"
                    id="tools"
                    value={formData.tools}
                    onChange={handleChange}
                    placeholder="e.g., React, Node.js, MongoDB, Python, etc."
                  />
                  <small className="form-text text-muted">
                    List the programming languages, frameworks, and tools used in this project
                  </small>
                </FormGroup>

                <FormGroup>
                  <Label for="gitHubUrl">GitHub Repository URL</Label>
                  <Input
                    type="url"
                    name="gitHubUrl"
                    id="gitHubUrl"
                    value={formData.gitHubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username/repository"
                  />
                  <small className="form-text text-muted">
                    Link to your project's source code repository
                  </small>
                </FormGroup>

                <FormGroup>
                  <Label for="liveSiteUrl">Live Site URL</Label>
                  <Input
                    type="url"
                    name="liveSiteUrl"
                    id="liveSiteUrl"
                    value={formData.liveSiteUrl}
                    onChange={handleChange}
                    placeholder="https://your-project-demo.com"
                  />
                  <small className="form-text text-muted">
                    Link to your live project demo or deployed application
                  </small>
                </FormGroup>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Button 
                    color="secondary" 
                    onClick={() => navigate('/projects')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    color="primary" 
                    disabled={loading}
                  >
                    {loading ? 'Creating Project...' : 'Create Project'}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateProject;
