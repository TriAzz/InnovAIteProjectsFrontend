import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Badge, Input, FormGroup, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, searchTerm, statusFilter, sortBy]);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProjects = () => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.tools && project.tools.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Sort projects
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'author':
        filtered.sort((a, b) => a.userName.localeCompare(b.userName));
        break;
      default:
        break;
    }

    setFilteredProjects(filtered);
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

  if (loading) {
    return (
      <Container className="py-5">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading projects...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4">All Projects</h1>
          <p className="text-center text-muted">
            Discover innovative projects from the InnovAIte community
          </p>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md="4">
          <FormGroup>
            <Label for="search">Search Projects</Label>
            <Input
              type="text"
              id="search"
              placeholder="Search by title, description, author, or tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label for="status">Filter by Status</Label>
            <Input
              type="select"
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label for="sort">Sort by</Label>
            <Input
              type="select"
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="author">Author (A-Z)</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md="2" className="d-flex align-items-end">
          <div className="text-muted">
            <strong>{filteredProjects.length}</strong> project{filteredProjects.length !== 1 ? 's' : ''}
          </div>
        </Col>
      </Row>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Row>
          <Col className="text-center py-5">
            <h4>No projects found</h4>
            <p className="text-muted">
              {searchTerm || statusFilter 
                ? 'Try adjusting your search or filter criteria.'
                : 'No projects have been created yet.'}
            </p>
          </Col>
        </Row>
      ) : (
        <div className="project-grid">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="h-100">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <CardTitle tag="h5">{project.title}</CardTitle>
                  <Badge className={getStatusBadgeClass(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                
                <CardText>
                  <small className="text-muted">
                    by {project.userName} • {formatDate(project.createdDate)}
                  </small>
                </CardText>
                
                <CardText>
                  {project.description.length > 120 
                    ? `${project.description.substring(0, 120)}...` 
                    : project.description}
                </CardText>
                
                {project.tools && (
                  <CardText>
                    <small className="text-muted">
                      <strong>Tools:</strong> {project.tools}
                    </small>
                  </CardText>
                )}
                
                <div className="mt-auto">
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
                          <i className="fab fa-github"></i>
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
                          <i className="fas fa-external-link-alt"></i>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default ProjectList;
