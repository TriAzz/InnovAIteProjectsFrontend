import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Category as CategoryIcon,
  AccessTime as AccessTimeIcon,
  GitHub as GitHubIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  CheckCircle as StatusIcon
} from '@mui/icons-material';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

// Status color mapping
const statusColors = {
  'Not Started': 'default',
  'In Progress': 'primary',
  'Completed': 'success'
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { fetchProjectById, deleteProject } = useProjects();
  
  // Check if edit mode is requested via query parameter
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const editParam = query.get('edit');
    if (editParam === 'true') {
      setIsEditMode(true);
    }
  }, [location]);
  
  // Fetch project details
  useEffect(() => {
    const getProject = async () => {
      try {
        setLoading(true);
        const data = await fetchProjectById(id);
        setProject(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };
    
    getProject();
  }, [id, fetchProjectById]);
  
  const handleEditClick = () => {
    setIsEditMode(true);
  };
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(id);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete project');
      setDeleteDialogOpen(false);
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };
  
  // Check if current user is creator or admin
  const canEdit = project && currentUser && 
    (project.creator?.id === currentUser.id || currentUser.role === 'admin');
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }
  
  if (!project) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 4 }}>
          Project not found
        </Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }
  
  // If edit mode is active, redirect to a form (to be implemented)
  if (isEditMode) {
    // In a real application, you might create a dedicated edit form
    // or reuse the CreateProject component with pre-filled values
    
    // For now, we'll just redirect back with a message
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ mt: 4 }}>
          Edit mode would be implemented here, with a form pre-filled with project data.
        </Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setIsEditMode(false)}
        >
          Back to Project
        </Button>
      </Container>
    );
  }
  
  const {
    title,
    description,
    githubLink,
    category,
    status,
    technologies = [],
    tags = [],
    creator,
    teamMembers = [],
    deadline,
    createdAt
  } = project;
  
  const formattedDeadline = deadline ? new Date(deadline).toLocaleDateString() : 'No deadline';
  const formattedCreatedAt = createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown';
  
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip
                label={status}
                color={statusColors[status]}
                size="medium"
                sx={{ mr: 2 }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                Created on {formattedCreatedAt}
              </Typography>
              {deadline && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="subtitle2">Deadline: {formattedDeadline}</Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          {canEdit && (
            <Box>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ mr: 1 }}
                onClick={handleEditClick}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {description}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Project Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Category" 
                    secondary={category} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <StatusIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Status" 
                    secondary={status} 
                  />
                </ListItem>
                
                {githubLink && (
                  <ListItem>
                    <ListItemIcon>
                      <GitHubIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="GitHub Repository" 
                      secondary={
                        <a 
                          href={githubLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {githubLink}
                        </a>
                      } 
                    />
                  </ListItem>
                )}
              </List>
            </Box>
            
            {technologies.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Technologies
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {technologies.map((tech, index) => (
                    <Chip key={index} label={tech} variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
            
            {tags.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon sx={{ mr: 1 }} /> Team
                </Typography>
                
                {creator && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {creator.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{creator.name}</Typography>
                      <Typography variant="caption" color="text.secondary">Creator</Typography>
                    </Box>
                  </Box>
                )}
                
                {teamMembers.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Team Members:</Typography>
                    {teamMembers.map((member, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ mr: 2, width: 32, height: 32, fontSize: '0.875rem' }}>
                          {member.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2">{member.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
                
                {!teamMembers.length && (
                  <Typography variant="body2" color="text.secondary">
                    No team members assigned yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ mt: 3, mb: 4, display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </Button>
      </Box>
      
      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>
          Delete Project
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectDetail;