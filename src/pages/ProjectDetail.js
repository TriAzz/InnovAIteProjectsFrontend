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
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  FormHelperText
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

// Updated categories to match backend schema
const categories = ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'DevOps', 'Research', 'Other'];
const statusOptions = ['Not Started', 'In Progress', 'Completed', 'On Hold'];
// Changed to Tools with new options
const toolOptions = ['Bolt', 'v0 (Vercel)', 'Cursor', 'Replit', 'Lovable', 'Windsurf', 'Tempo Labs', 'Fynix', 'GitHub CoPilot', 'Augment'];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditProjectForm = ({ project, onCancel }) => {
  const navigate = useNavigate();
  const { updateProject } = useProjects();
  
  const [formData, setFormData] = useState({
    title: project.title || '',
    description: project.description || '',
    githubLink: project.githubLink || '',
    liveSiteUrl: project.liveSiteUrl || '',
    category: project.category || '',
    status: project.status || 'Not Started',
    technologies: project.technologies || [],
    tags: Array.isArray(project.tags) ? project.tags.join(', ') : ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.technologies.length === 0) {
      newErrors.technologies = 'Please select at least one tool';
    }
    
    // Removed URL validation for GitHub link and live site URL as requested
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleToolChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      technologies: typeof value === 'string' ? value.split(',') : value,
    }));
    
    // Clear error when field is edited
    if (errors.technologies) {
      setErrors(prev => ({
        ...prev,
        technologies: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setSubmitting(true);
    setSubmitError('');
    
    try {
      // Process tags from comma-separated string to array
      const processedTags = formData.tags ? 
        formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : 
        [];
      
      // Create project data object with deadline carried over from original project
      const projectData = {
        ...formData,
        tags: processedTags,
        deadline: project.deadline // Keep the original deadline
      };
      
      await updateProject(project._id, projectData);
      navigate(`/projects/${project._id}`);
    } catch (error) {
      setSubmitError(error.message || 'Failed to update project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="title"
            name="title"
            label="Project Title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="description"
            name="description"
            label="Project Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="githubLink"
            name="githubLink"
            label="GitHub Repository URL (Optional)"
            placeholder="https://github.com/username/repo"
            value={formData.githubLink}
            onChange={handleChange}
            error={!!errors.githubLink}
            helperText={errors.githubLink}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="liveSiteUrl"
            name="liveSiteUrl"
            label="Live Site URL (Optional)"
            placeholder="https://example.com"
            value={formData.liveSiteUrl}
            onChange={handleChange}
            error={!!errors.liveSiteUrl}
            helperText={errors.liveSiteUrl}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.category}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth required error={!!errors.technologies}>
            <InputLabel id="technologies-label">Tools</InputLabel>
            <Select
              labelId="technologies-label"
              id="technologies"
              multiple
              value={formData.technologies}
              onChange={handleToolChange}
              input={<OutlinedInput id="select-technologies" label="Tools" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {toolOptions.map((tool) => (
                <MenuItem key={tool} value={tool}>
                  {tool}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText error={!!errors.technologies}>
              {errors.technologies || "Select one or more tools"}
            </FormHelperText>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="tags"
            name="tags"
            label="Tags"
            placeholder="Enter tags separated by commas"
            value={formData.tags}
            onChange={handleChange}
            helperText="E.g. frontend, database, API"
          />
        </Grid>
        
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
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
  
  // Check if current user is creator or admin - improved to match ProjectCard component logic
  const canEdit = project && currentUser && (
    // Check all possible ID formats
    (project.creator?._id && currentUser._id && project.creator._id === currentUser._id) || 
    (project.creator?._id && currentUser.id && project.creator._id === currentUser.id) || 
    (project.creator?.id && currentUser._id && project.creator.id === currentUser._id) || 
    (project.creator?.id && currentUser.id && project.creator.id === currentUser.id) ||
    // Also check by email for extra reliability
    (project.creator?.email && currentUser.email && project.creator.email === currentUser.email) ||
    // Admin check
    (currentUser.role === 'admin')
  );
  
  // Log creator check details for debugging
  console.log('ProjectDetail creator check:', {
    projectId: id,
    projectTitle: project?.title,
    creator: project?.creator ? {
      id: project.creator.id, 
      _id: project.creator._id,
      email: project.creator.email
    } : 'No creator',
    currentUser: currentUser ? {
      id: currentUser.id, 
      _id: currentUser._id,
      email: currentUser.email
    } : 'Not logged in',
    canEdit: canEdit
  });
  
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
  
  // If edit mode is active, show edit form
  if (isEditMode) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Project
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {project && <EditProjectForm project={project} onCancel={() => setIsEditMode(false)} />}
        </Paper>
      </Container>
    );
  }
  
  const {
    title,
    description,
    githubLink,
    liveSiteUrl,
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
                
                {liveSiteUrl && (
                  <ListItem>
                    <ListItemIcon>
                      <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
                        <path fill="currentColor" d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                      </svg>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Live Site URL" 
                      secondary={
                        <a 
                          href={liveSiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#1976d2', textDecoration: 'underline' }}
                        >
                          {liveSiteUrl}
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