import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Badge, Alert, Form, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchProject();
    fetchComments();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getById(id);
      setProject(response.data);
      setEditFormData(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getByProjectId(id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await commentsAPI.create({
        projectId: id,
        content: newComment.trim()
      });
      setNewComment('');
      setError('');
      alert('Comment submitted successfully! It will be visible after approval.');
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.update(id, editFormData);
      setProject(editFormData);
      setEditModalOpen(false);
      setError('');
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectsAPI.delete(id);
        navigate('/projects', { 
          state: { message: 'Project deleted successfully' } 
        });
      } catch (error) {
        console.error('Error deleting project:', error);
        setError('Failed to delete project');
      }
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEdit = user && (user.id === project?.userId || user.role === 'Admin');

  if (loading) {
    return (
      <Container className="py-5">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container className="py-5">
        <Alert color="danger">
          <h4>Project Not Found</h4>
          <p>The project you're looking for doesn't exist or has been removed.</p>
          <Button color="primary" tag={Link} to="/projects">
            Back to Projects
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {error && (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        <Col lg="8">
          <Card className="mb-4">
            <CardBody>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <CardTitle tag="h1" className="mb-2">{project.title}</CardTitle>
                  <p className="text-muted mb-0">
                    by {project.userName} • Created {formatDate(project.createdDate)}
                    {project.modifiedDate !== project.createdDate && (
                      <span> • Updated {formatDate(project.modifiedDate)}</span>
                    )}
                  </p>
                </div>
                <Badge className={getStatusBadgeClass(project.status)} style={{ fontSize: '0.9rem' }}>
                  {project.status}
                </Badge>
              </div>

              <CardText style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                {project.description}
              </CardText>

              {project.tools && (
                <div className="mb-3">
                  <strong>Tools & Technologies:</strong>
                  <p className="mb-0 text-muted">{project.tools}</p>
                </div>
              )}

              <div className="d-flex gap-2 mb-3">
                {project.gitHubUrl && (
                  <Button 
                    color="dark" 
                    href={project.gitHubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-github me-2"></i>
                    View on GitHub
                  </Button>
                )}
                {project.liveSiteUrl && (
                  <Button 
                    color="success" 
                    href={project.liveSiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-external-link-alt me-2"></i>
                    Visit Live Site
                  </Button>
                )}
              </div>

              {canEdit && (
                <div className="d-flex gap-2">
                  <Button 
                    color="primary" 
                    size="sm"
                    onClick={() => setEditModalOpen(true)}
                  >
                    Edit Project
                  </Button>
                  <Button 
                    color="danger" 
                    size="sm"
                    onClick={handleDelete}
                  >
                    Delete Project
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Comments Section */}
          <div className="comment-section">
            <h4 className="mb-4">Comments ({comments.length})</h4>

            {user && (
              <Form onSubmit={handleCommentSubmit} className="mb-4">
                <FormGroup>
                  <Input
                    type="textarea"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows="3"
                    required
                  />
                </FormGroup>
                <Button 
                  type="submit" 
                  color="primary" 
                  disabled={submittingComment}
                >
                  {submittingComment ? 'Submitting...' : 'Submit Comment'}
                </Button>
              </Form>
            )}

            {comments.length === 0 ? (
              <p className="text-muted text-center py-4">
                No comments yet. {user ? 'Be the first to comment!' : 'Login to add a comment.'}
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-author">{comment.userName}</div>
                  <div className="comment-date">{formatDate(comment.createdDate)}</div>
                  <div className="comment-content">{comment.content}</div>
                </div>
              ))
            )}
          </div>
        </Col>

        <Col lg="4">
          <Card>
            <CardBody>
              <h5>Project Information</h5>
              <hr />
              <div className="mb-3">
                <strong>Status:</strong>
                <br />
                <Badge className={`${getStatusBadgeClass(project.status)} mt-1`}>
                  {project.status}
                </Badge>
              </div>
              <div className="mb-3">
                <strong>Created:</strong>
                <br />
                <span className="text-muted">{formatDate(project.createdDate)}</span>
              </div>
              {project.modifiedDate !== project.createdDate && (
                <div className="mb-3">
                  <strong>Last Updated:</strong>
                  <br />
                  <span className="text-muted">{formatDate(project.modifiedDate)}</span>
                </div>
              )}
              <div className="mb-3">
                <strong>Author:</strong>
                <br />
                <span className="text-muted">{project.userName}</span>
              </div>
              {project.tools && (
                <div className="mb-3">
                  <strong>Technologies:</strong>
                  <br />
                  <span className="text-muted">{project.tools}</span>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} toggle={() => setEditModalOpen(false)} size="lg">
        <Form onSubmit={handleEdit}>
          <ModalHeader toggle={() => setEditModalOpen(false)}>
            Edit Project
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input
                type="text"
                value={editFormData.title || ''}
                onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                placeholder="Project Title"
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="textarea"
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                placeholder="Project Description"
                rows="5"
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="select"
                value={editFormData.status || ''}
                onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                value={editFormData.tools || ''}
                onChange={(e) => setEditFormData({...editFormData, tools: e.target.value})}
                placeholder="Tools & Technologies"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="url"
                value={editFormData.gitHubUrl || ''}
                onChange={(e) => setEditFormData({...editFormData, gitHubUrl: e.target.value})}
                placeholder="GitHub URL"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="url"
                value={editFormData.liveSiteUrl || ''}
                onChange={(e) => setEditFormData({...editFormData, liveSiteUrl: e.target.value})}
                placeholder="Live Site URL"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Save Changes
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Container>
  );
};

export default ProjectDetail;
