import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Badge, Alert, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    notStartedProjects: 0,
  });

  useEffect(() => {
    if (user) {
      fetchMyProjects();
    }
  }, [user]);

  const fetchMyProjects = async () => {
    try {
      const response = await projectsAPI.getMyProjects();
      const projects = response.data;
      setMyProjects(projects);
      
      // Calculate stats
      setStats({
        totalProjects: projects.length,
        completedProjects: projects.filter(p => p.status === 'Completed').length,
        inProgressProjects: projects.filter(p => p.status === 'In Progress').length,
        notStartedProjects: projects.filter(p => p.status === 'Not Started').length,
      });
    } catch (error) {
      console.error('Error fetching my projects:', error);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <Container className="py-5">
        <Alert color="warning" className="text-center">
          <h4>Please log in to view your profile</h4>
          <Button color="primary" tag={Link} to="/login">
            Go to Login
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg="4">
          <Card className="mb-4">
            <CardBody className="text-center">
              <div className="mb-3">
                <div 
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                >
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
              </div>
              <h4>{user.firstName} {user.lastName}</h4>
              <p className="text-muted">{user.email}</p>
              {user.role && (
                <Badge color="primary" className="mb-3">
                  {user.role}
                </Badge>
              )}
              {user.description && (
                <p className="text-muted">{user.description}</p>
              )}
              <Button color="outline-danger" size="sm" onClick={logout}>
                Logout
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h5>Project Statistics</h5>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Total Projects:</span>
                <strong>{stats.totalProjects}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Completed:</span>
                <strong className="text-success">{stats.completedProjects}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>In Progress:</span>
                <strong className="text-warning">{stats.inProgressProjects}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Not Started:</span>
                <strong className="text-secondary">{stats.notStartedProjects}</strong>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="8">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>My Dashboard</h4>
                <Button color="primary" tag={Link} to="/create-project">
                  Create New Project
                </Button>
              </div>

              <Nav tabs>
                <NavItem>
                  <NavLink 
                    className={activeTab === 'projects' ? 'active' : ''}
                    onClick={() => setActiveTab('projects')}
                    href="#"
                  >
                    My Projects ({myProjects.length})
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink 
                    className={activeTab === 'settings' ? 'active' : ''}
                    onClick={() => setActiveTab('settings')}
                    href="#"
                  >
                    Settings
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab}>
                <TabPane tabId="projects">
                  <div className="mt-4">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : myProjects.length === 0 ? (
                      <div className="text-center py-5">
                        <h5>No projects yet</h5>
                        <p className="text-muted">Start by creating your first project!</p>
                        <Button color="primary" tag={Link} to="/create-project">
                          Create Your First Project
                        </Button>
                      </div>
                    ) : (
                      <div className="row">
                        {myProjects.map((project) => (
                          <div key={project.id} className="col-md-6 mb-4">
                            <Card className="h-100">
                              <CardBody>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <CardTitle tag="h6">{project.title}</CardTitle>
                                  <Badge className={getStatusBadgeClass(project.status)}>
                                    {project.status}
                                  </Badge>
                                </div>
                                <CardText>
                                  <small className="text-muted">
                                    Created {formatDate(project.createdDate)}
                                  </small>
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
                                <div className="d-flex justify-content-between align-items-center mt-3">
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
                                        Live
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabPane>

                <TabPane tabId="settings">
                  <div className="mt-4">
                    <h5>Account Settings</h5>
                    <hr />
                    <div className="mb-3">
                      <strong>Name:</strong> {user.firstName} {user.lastName}
                    </div>
                    <div className="mb-3">
                      <strong>Email:</strong> {user.email}
                    </div>
                    <div className="mb-3">
                      <strong>Role:</strong> {user.role || 'User'}
                    </div>
                    <div className="mb-3">
                      <strong>Member since:</strong> {formatDate(user.createdDate)}
                    </div>
                    {user.description && (
                      <div className="mb-3">
                        <strong>Description:</strong> {user.description}
                      </div>
                    )}
                    <Alert color="info">
                      <strong>Note:</strong> Profile editing functionality will be available in a future update.
                    </Alert>
                  </div>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
