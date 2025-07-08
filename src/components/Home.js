import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardText, Badge, Alert } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { projectsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    notStartedProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [needsAdminSetup, setNeedsAdminSetup] = useState(false);

  useEffect(() => {
    checkSystemSetup();
  }, []);

  const checkSystemSetup = async () => {
    try {
      // First check if any users exist
      const usersResponse = await usersAPI.getAll();
      if (!usersResponse.data || usersResponse.data.length === 0) {
        setNeedsAdminSetup(true);
        setLoading(false);
        return;
      }
      
      // If users exist, proceed to fetch projects
      fetchRecentProjects();
    } catch (error) {
      // If we can't get users, assume we need admin setup
      console.log('System needs setup');
      setNeedsAdminSetup(true);
      setLoading(false);
    }
  };

  const fetchRecentProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      const projects = response.data;
      
      // Get the 6 most recent projects
      const sortedProjects = projects.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setRecentProjects(sortedProjects.slice(0, 6));
      
      // Calculate stats
      setStats({
        totalProjects: projects.length,
        completedProjects: projects.filter(p => p.status === 'Completed').length,
        inProgressProjects: projects.filter(p => p.status === 'In Progress').length,
        notStartedProjects: projects.filter(p => p.status === 'Not Started').length,
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge-completed';
      case 'In Progress': return 'badge-in-progress';
      case 'Not Started': return 'badge-not-started';
      default: return 'badge-not-started';
    }
  };

  // If admin setup is needed, redirect to admin setup page
  if (needsAdminSetup) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg="6">
            <Alert color="info" className="text-center">
              <h4>System Setup Required</h4>
              <p>
                The system needs to be set up with an initial administrator account.
                Please click the button below to create the admin account.
              </p>
              <Button 
                color="primary" 
                size="lg"
                onClick={() => navigate('/admin-setup')}
              >
                Set Up Admin Account
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg="8">
              <h1>Welcome to InnovAIte Projects Dashboard</h1>
              <p className="lead">
                Discover, showcase, and collaborate on innovative projects within the InnovAIte community.
                Connect with fellow developers, share your work, and get feedback on your projects.
              </p>
              {user ? (
                <div>
                  <Button 
                    color="light" 
                    size="lg" 
                    className="me-3"
                    tag={Link}
                    to="/create-project"
                  >
                    Create New Project
                  </Button>
                  <Button 
                    color="outline-light" 
                    size="lg"
                    tag={Link}
                    to="/projects"
                  >
                    Browse Projects
                  </Button>
                </div>
              ) : (
                <div>
                  <Button 
                    color="light" 
                    size="lg" 
                    className="me-3"
                    tag={Link}
                    to="/register"
                  >
                    Join InnovAIte
                  </Button>
                  <Button 
                    color="outline-light" 
                    size="lg"
                    tag={Link}
                    to="/login"
                  >
                    Login
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center">
            <Col lg="3" md="6" className="mb-4">
              <Card className="h-100">
                <CardBody>
                  <h3 className="text-primary">{stats.totalProjects}</h3>
                  <p className="mb-0">Total Projects</p>
                </CardBody>
              </Card>
            </Col>
            <Col lg="3" md="6" className="mb-4">
              <Card className="h-100">
                <CardBody>
                  <h3 className="text-success">{stats.completedProjects}</h3>
                  <p className="mb-0">Completed</p>
                </CardBody>
              </Card>
            </Col>
            <Col lg="3" md="6" className="mb-4">
              <Card className="h-100">
                <CardBody>
                  <h3 className="text-warning">{stats.inProgressProjects}</h3>
                  <p className="mb-0">In Progress</p>
                </CardBody>
              </Card>
            </Col>
            <Col lg="3" md="6" className="mb-4">
              <Card className="h-100">
                <CardBody>
                  <h3 className="text-secondary">{stats.notStartedProjects}</h3>
                  <p className="mb-0">Not Started</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Recent Projects Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 className="text-center mb-4">Recent Projects</h2>
            </Col>
          </Row>
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="project-grid">
              {recentProjects.map((project) => (
                <Card key={project.id} className="h-100">
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <CardTitle tag="h5">{project.title}</CardTitle>
                      <Badge className={getStatusBadgeClass(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardText>
                      <small className="text-muted">by {project.userName}</small>
                    </CardText>
                    <CardText>
                      {project.description.length > 100 
                        ? `${project.description.substring(0, 100)}...` 
                        : project.description}
                    </CardText>
                    {project.tools && (
                      <CardText>
                        <small className="text-muted">
                          <strong>Tools:</strong> {project.tools}
                        </small>
                      </CardText>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <Button 
                        color="primary" 
                        size="sm"
                        tag={Link}
                        to={`/projects/${project.id}`}
                      >
                        View Details
                      </Button>
                      <div>
                        {project.gitHubUrl && (
                          <Button 
                            color="outline-dark" 
                            size="sm" 
                            className="me-2"
                            href={project.gitHubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            GitHub
                          </Button>
                        )}
                        {project.liveSiteUrl && (
                          <Button 
                            color="outline-success" 
                            size="sm"
                            href={project.liveSiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Live Site
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
          
          <Row className="mt-4">
            <Col className="text-center">
              <Button 
                color="primary" 
                size="lg"
                tag={Link}
                to="/projects"
              >
                View All Projects
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
