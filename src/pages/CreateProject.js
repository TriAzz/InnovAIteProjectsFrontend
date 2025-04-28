import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormHelperText,
  Grid,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useProjects } from '../context/ProjectContext';

const categories = ['Hobby Projects', 'InnovAIte Tools', 'Research', 'Other'];
const statusOptions = ['Not Started', 'In Progress', 'Completed'];
const technologyOptions = ['React', 'Node.js', 'MongoDB', 'Express', 'Django', 'Python', 'Java', 'Windsurf', 'Other'];

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

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubLink: '',
    category: '',
    status: 'Not Started',
    technologies: [],
    tags: '',
    deadline: null
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { addProject } = useProjects();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.githubLink && 
        !/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/.test(formData.githubLink)) {
      newErrors.githubLink = 'Please enter a valid GitHub repository URL';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
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

  const handleTechChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      technologies: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleTagsChange = (e) => {
    setFormData(prev => ({
      ...prev,
      tags: e.target.value
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      deadline: newDate
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!validate()) {
      console.log('Validation failed with errors:', errors);
      return;
    }
    
    setSubmitting(true);
    setSubmitError('');
    
    try {
      // Process tags from comma-separated string to array
      const processedTags = formData.tags ? 
        formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : 
        [];
      
      // Create project data object
      const projectData = {
        ...formData,
        tags: processedTags
      };
      
      console.log('Sending project data:', projectData);
      await addProject(projectData);
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error.message || 'Failed to create project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Project
        </Typography>
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
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
                label="GitHub Repository URL"
                placeholder="https://github.com/username/repo"
                value={formData.githubLink}
                onChange={handleChange}
                error={!!errors.githubLink}
                helperText={errors.githubLink}
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
              <FormControl fullWidth>
                <InputLabel id="technologies-label">Technologies</InputLabel>
                <Select
                  labelId="technologies-label"
                  id="technologies"
                  multiple
                  value={formData.technologies}
                  onChange={handleTechChange}
                  input={<OutlinedInput id="select-technologies" label="Technologies" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {technologyOptions.map((tech) => (
                    <MenuItem key={tech} value={tech}>
                      {tech}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select one or more technologies</FormHelperText>
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
                onChange={handleTagsChange}
                helperText="E.g. frontend, database, API"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Deadline (Optional)"
                  value={formData.deadline}
                  onChange={handleDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Create Project'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateProject;