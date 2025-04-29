import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  InputAdornment,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  FilterAlt as FilterAltIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';

// Constants for filter options
const categories = ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'DevOps', 'Research', 'Other'];
const statusOptions = ['Not Started', 'In Progress', 'Completed', 'On Hold'];
const toolOptions = ['Bolt', 'v0 (Vercel)', 'Cursor', 'Replit', 'Lovable', 'Windsurf', 'Tempo Labs', 'Fynix', 'GitHub CoPilot', 'Augment'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    projects, 
    loading, 
    error,
    filters: contextFilters,
    updateFilters, 
    clearFilters, 
    fetchProjects 
  } = useProjects();

  // Local filter state (UI state)
  const [localFilters, setLocalFilters] = useState({
    search: '',
    category: '',
    status: '',
    technology: ''
  });
  
  // State for filter panel visibility on mobile
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showFilters, setShowFilters] = useState(!isMobile);
  
  // Track if any filter is active
  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  // Execute full reset filters behavior (clear filters + load all projects) on component mount
  useEffect(() => {
    // Clear filters in context
    clearFilters();
    
    // Reset local filter state
    setLocalFilters({
      search: '',
      category: '',
      status: '',
      technology: ''
    });
    
    // Fetch all projects with a force refresh to ensure latest data
    fetchProjects(true);
    
    // Log that we've performed this action
    console.log('Dashboard: Auto-reset filters and fetched all projects on mount');
  }, []); // Empty dependency array ensures this runs only once on mount

  // Initialize local filters from context
  useEffect(() => {
    setLocalFilters({
      search: contextFilters.search || '',
      category: contextFilters.category || '',
      status: contextFilters.status || '',
      technology: contextFilters.technology || ''
    });
  }, [contextFilters]);

  // Handle search input change
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setLocalFilters(prev => ({ ...prev, search: value }));
  };

  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle filter submission
  const handleApplyFilters = () => {
    updateFilters(localFilters);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setLocalFilters({
      search: '',
      category: '',
      status: '',
      technology: ''
    });
    clearFilters();
  };

  // Remove a single filter
  const handleRemoveFilter = (filterName) => {
    setLocalFilters(prev => ({ ...prev, [filterName]: '' }));
    updateFilters({ ...localFilters, [filterName]: '' });
  };

  // Toggle filter panel visibility (mobile)
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  // Navigate to create project page
  const handleCreateProject = () => {
    navigate('/create-project');
  };

  // Refresh projects list
  const handleRefresh = useCallback(() => {
    fetchProjects(true); // true forces a refresh
  }, [fetchProjects]);

  // Render active filter chips for visual feedback
  const renderFilterChips = () => {
    const chips = [];
    
    if (localFilters.search) {
      chips.push(
        <Chip 
          key="search" 
          label={`Search: ${localFilters.search}`}
          onDelete={() => handleRemoveFilter('search')} 
          color="primary" 
          variant="outlined"
          size="small"
        />
      );
    }
    
    if (localFilters.category) {
      chips.push(
        <Chip 
          key="category" 
          label={`Category: ${localFilters.category}`}
          onDelete={() => handleRemoveFilter('category')} 
          color="primary" 
          variant="outlined"
          size="small"
        />
      );
    }
    
    if (localFilters.status) {
      chips.push(
        <Chip 
          key="status" 
          label={`Status: ${localFilters.status}`}
          onDelete={() => handleRemoveFilter('status')} 
          color="primary" 
          variant="outlined"
          size="small"
        />
      );
    }
    
    if (localFilters.technology) {
      chips.push(
        <Chip 
          key="technology" 
          label={`Tool: ${localFilters.technology}`}
          onDelete={() => handleRemoveFilter('technology')} 
          color="primary" 
          variant="outlined"
          size="small"
        />
      );
    }
    
    return chips;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Projects Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh Projects">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateProject}
            >
              Create Project
            </Button>
          </Box>
        </Box>
        
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search projects by title or description"
            variant="outlined"
            value={localFilters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: localFilters.search ? (
                <InputAdornment position="end">
                  <IconButton 
                    edge="end" 
                    onClick={() => {
                      setLocalFilters(prev => ({ ...prev, search: '' }));
                      if (contextFilters.search) {
                        updateFilters({ search: '' });
                      }
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleApplyFilters();
              }
            }}
          />
        </Box>
        
        {/* Filter Toggle Button (Mobile Only) */}
        {isMobile && (
          <Button 
            fullWidth
            onClick={toggleFilters}
            startIcon={<FilterListIcon />}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        )}
        
        {/* Filters Section */}
        {showFilters && (
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterAltIcon sx={{ mr: 1 }} /> Filters
              </Typography>
              {isMobile && (
                <IconButton onClick={toggleFilters} size="small">
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={localFilters.category}
                    label="Category"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={localFilters.status}
                    label="Status"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="technology-label">Tool</InputLabel>
                  <Select
                    labelId="technology-label"
                    id="technology"
                    name="technology"
                    value={localFilters.technology}
                    label="Tool"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All Tools</MenuItem>
                    {toolOptions.map((tool) => (
                      <MenuItem key={tool} value={tool}>
                        {tool}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleResetFilters}
                disabled={!hasActiveFilters}
              >
                Reset Filters
              </Button>
              <Button 
                variant="contained" 
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </Box>
          </Paper>
        )}
        
        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {renderFilterChips()}
            {renderFilterChips().length > 1 && (
              <Chip 
                label="Clear All Filters" 
                onClick={handleResetFilters} 
                color="secondary"
                size="small"
              />
            )}
          </Box>
        )}
        
        {/* Error and Loading States */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Projects Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {projects && projects.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={project._id}>
                      <ProjectCard project={project} />
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Box sx={{ my: 4, textAlign: 'center' }}>
                {hasActiveFilters ? (
                  <>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      No projects match your filters
                    </Typography>
                    <Button 
                      variant="outlined" 
                      onClick={handleResetFilters}
                      startIcon={<FilterListIcon />}
                    >
                      Clear All Filters
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      No projects found
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={handleCreateProject}
                      startIcon={<AddIcon />}
                    >
                      Create Your First Project
                    </Button>
                  </>
                )}
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;