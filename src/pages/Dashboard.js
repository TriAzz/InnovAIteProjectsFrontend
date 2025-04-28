import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';

const statusOptions = ['All', 'Not Started', 'In Progress', 'Completed'];
const categoryOptions = ['All', 'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'DevOps', 'Research', 'Other'];
const technologyOptions = ['All', 'Bolt', 'v0 (Vercel)', 'Cursor', 'Replit', 'Lovable', 'Windsurf', 'Tempo Labs', 'Fynix', 'GitHub CoPilot', 'Augment'];

const Dashboard = () => {
  const { projects, loading, error, filters, updateFilters, fetchProjects } = useProjects();
  const { currentUser } = useAuth();
  const location = useLocation();
  
  const [localFilters, setLocalFilters] = useState({
    search: '',
    status: 'All',
    category: 'All',
    technology: 'All'
  });

  // Load projects on initial load and navigation
  useEffect(() => {
    console.log('Dashboard mounted or navigation changed - loading projects');
    
    // Reset local filters to match default values
    setLocalFilters({
      search: '',
      status: 'All',
      category: 'All',
      technology: 'All'
    });
    
    // Just fetch projects without resetting filters in context
    // This ensures we don't interfere with any existing filters
    fetchProjects(true);
    
    // Remove any navigation flags
    sessionStorage.removeItem('dashboard_needs_refresh');
  }, [location.pathname, fetchProjects]);

  // Update local filters when context filters change
  useEffect(() => {
    if (
      filters.search !== (localFilters.search || '') ||
      (filters.status || 'All') !== localFilters.status ||
      (filters.category || 'All') !== localFilters.category ||
      (filters.technology || 'All') !== localFilters.technology
    ) {
      setLocalFilters({
        search: filters.search || '',
        status: filters.status ? filters.status : 'All',
        category: filters.category ? filters.category : 'All',
        technology: filters.technology ? filters.technology : 'All'
      });
    }
  }, [filters, localFilters]);

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
    
    // Update context filters
    updateFilters(apiFilters);
    
    // Fetch projects with new filters
    fetchProjects(true);
  };

  const resetFilters = () => {
    // Reset local UI filters
    setLocalFilters({
      search: '',
      status: 'All',
      category: 'All',
      technology: 'All'
    });
    
    // Reset context filters
    updateFilters({
      search: '',
      status: '',
      category: '',
      technology: ''
    });
    
    // Force fetch projects with reset filters
    fetchProjects(true);
  };

  // Function to handle refresh button click - keeps current filters
  const handleRefresh = () => {
    console.log('Manual refresh requested - keeping current filters');
    fetchProjects(true);
  };

  // Function to handle individual filter chip removal
  const handleFilterChipDelete = (filterName) => {
    // Update local filters first
    const newLocalFilters = { 
      ...localFilters, 
      [filterName]: filterName === 'search' ? '' : 'All' 
    };
    setLocalFilters(newLocalFilters);
    
    // Create API filters object with the updated value
    const apiFilters = {
      ...filters,  // Start with current context filters
      // Only update the filter that was deleted
      [filterName]: filterName === 'search' ? '' : ''  // Empty string for API regardless of filter type
    };
    
    // Update context filters and fetch projects
    updateFilters(apiFilters);
    fetchProjects(true);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project Planner Board
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            component={RouterLink}
            to="/create-project"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Create Project
          </Button>
        </Box>
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
              <Chip 
                label={`Search: ${localFilters.search}`} 
                onDelete={() => handleFilterChipDelete('search')} 
              />
            )}
            {localFilters.status !== 'All' && (
              <Chip 
                label={`Status: ${localFilters.status}`} 
                onDelete={() => handleFilterChipDelete('status')} 
              />
            )}
            {localFilters.category !== 'All' && (
              <Chip 
                label={`Category: ${localFilters.category}`} 
                onDelete={() => handleFilterChipDelete('category')} 
              />
            )}
            {localFilters.technology !== 'All' && (
              <Chip 
                label={`Tool: ${localFilters.technology}`} 
                onDelete={() => handleFilterChipDelete('technology')} 
              />
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