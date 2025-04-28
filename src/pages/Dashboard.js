import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Chip,
  Stack,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';

const statusOptions = ['All', 'Not Started', 'In Progress', 'Completed'];
const categoryOptions = ['All', 'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'DevOps', 'Research', 'Other'];
const technologyOptions = ['All', 'Bolt', 'v0 (Vercel)', 'Cursor', 'Replit', 'Lovable', 'Windsurf', 'Tempo Labs', 'Fynix', 'GitHub CoPilot', 'Augment'];

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { projects, loading, error, filters, updateFilters, fetchProjects } = useProjects();
  
  const [localFilters, setLocalFilters] = useState({
    search: '',
    status: 'All',
    category: 'All',
    technology: 'All'
  });

  useEffect(() => {
    // Set initial local filters from context
    setLocalFilters({
      search: filters.search || '',
      status: filters.status || 'All',
      category: filters.category || 'All',
      technology: filters.technology || 'All'
    });
    
    // Force a projects fetch on mount
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    // Convert "All" values to empty strings for the API
    const apiFilters = {
      search: localFilters.search,
      status: localFilters.status === 'All' ? '' : localFilters.status,
      category: localFilters.category === 'All' ? '' : localFilters.category,
      technology: localFilters.technology === 'All' ? '' : localFilters.technology
    };
    updateFilters(apiFilters);
  };

  const resetFilters = () => {
    setLocalFilters({
      search: '',
      status: 'All',
      category: 'All',
      technology: 'All'
    });
    updateFilters({
      search: '',
      status: '',
      category: '',
      technology: ''
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project Planner Board
        </Typography>
        <Button
          component={RouterLink}
          to="/create-project"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Create Project
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4, p: 2, borderRadius: 1, bgcolor: 'background.paper', boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Filter Projects
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Search"
              name="search"
              value={localFilters.search}
              onChange={handleFilterChange}
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search by title or description"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={localFilters.status}
                onChange={handleFilterChange}
                label="Status"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={localFilters.category}
                onChange={handleFilterChange}
                label="Category"
              >
                {categoryOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tool</InputLabel>
              <Select
                name="technology"
                value={localFilters.technology}
                onChange={handleFilterChange}
                label="Tool"
              >
                {technologyOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={resetFilters} sx={{ mr: 1 }} variant="outlined">
            Reset
          </Button>
          <Button onClick={applyFilters} variant="contained">
            Apply Filters
          </Button>
        </Box>
      </Box>

      {/* Active Filters */}
      {(localFilters.search || localFilters.status !== 'All' || 
        localFilters.category !== 'All' || localFilters.technology !== 'All') && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Active Filters:</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {localFilters.search && (
              <Chip label={`Search: ${localFilters.search}`} onDelete={() => {
                setLocalFilters(prev => ({ ...prev, search: '' }));
              }} />
            )}
            {localFilters.status !== 'All' && (
              <Chip label={`Status: ${localFilters.status}`} onDelete={() => {
                setLocalFilters(prev => ({ ...prev, status: 'All' }));
              }} />
            )}
            {localFilters.category !== 'All' && (
              <Chip label={`Category: ${localFilters.category}`} onDelete={() => {
                setLocalFilters(prev => ({ ...prev, category: 'All' }));
              }} />
            )}
            {localFilters.technology !== 'All' && (
              <Chip label={`Tool: ${localFilters.technology}`} onDelete={() => {
                setLocalFilters(prev => ({ ...prev, technology: 'All' }));
              }} />
            )}
          </Stack>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : projects.length === 0 ? (
        <Alert severity="info">
          No projects found. {' '}
          <RouterLink to="/create-project" style={{ textDecoration: 'none' }}>
            Create your first project
          </RouterLink>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item key={project._id} xs={12} sm={6} md={4}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;