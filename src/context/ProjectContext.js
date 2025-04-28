import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { projectServices } from '../services/api';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    // Initialize projects from localStorage if available
    const cachedProjects = localStorage.getItem('cachedProjects');
    return cachedProjects ? JSON.parse(cachedProjects) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    technology: '',
    search: ''
  });
  
  // Add a cache for individual projects to improve performance
  const projectCache = useRef({});
  // Add a timestamp for the last projects fetch to manage cache invalidation
  const lastFetchTimestamp = useRef(null);
  // Add a retry mechanism for handling auth token issues
  const fetchAttempts = useRef(0);
  const maxRetries = 2;
  
  const { currentUser, isAuthenticated } = useAuth();

  // Handle initial loading and refresh cases
  useEffect(() => {
    console.log('ProjectContext: Authentication state changed', { currentUser, isAuthenticated });
    
    // Always check for cached auth, regardless of React state
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (token && user) {
      console.log('Token and user found in localStorage, fetching projects');
      fetchAttempts.current = 0;
      // ALWAYS force a refresh on mount or auth changes to prevent blank dashboard
      fetchProjects(true);
    } else if (isAuthenticated && currentUser) {
      console.log('User is authenticated via context, fetching projects');
      fetchAttempts.current = 0;
      fetchProjects(true);
    } else {
      console.log('No authentication found, clearing projects');
      setProjects([]);
      clearCache();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isAuthenticated]);
  
  // Stabilize filter values using a ref to prevent unnecessary refreshes
  const filtersRef = useRef(filters);
  
  // Memoized function to check if filters have actually changed
  const haveFiltersChanged = (newFilters, oldFilters) => {
    return newFilters.search !== oldFilters.search || 
           newFilters.category !== oldFilters.category ||
           newFilters.status !== oldFilters.status ||
           newFilters.technology !== oldFilters.technology;
  };
  
  // Separate effect for filter changes (don't force refresh)
  useEffect(() => {
    // Skip filter-based fetching on initial mount - the auth effect will handle it
    if (lastFetchTimestamp.current && haveFiltersChanged(filters, filtersRef.current)) {
      // Only fetch based on filters if we've already loaded projects once and filters actually changed
      console.log('Filters changed, fetching projects with new filters');
      filtersRef.current = {...filters};
      fetchProjects(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projects && projects.length > 0) {
      localStorage.setItem('cachedProjects', JSON.stringify(projects));
    }
  }, [projects]);

  // Fetch all projects based on filters
  const fetchProjects = useCallback(async (forceRefresh = false) => {
    // Check if we have a token even if isAuthenticated is not yet updated
    const token = localStorage.getItem('token');
    
    // Don't attempt to fetch if we don't have authentication 
    if (!token) {
      console.log('No token found, skipping project fetch');
      return [];
    }
    
    setLoading(true);
    setError('');
    console.log('Fetching projects with filters:', filters);
    console.log('Force refresh:', forceRefresh);

    try {
      // Convert filters to API query params
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.technology) params.technology = filters.technology;
      
      // ALWAYS add a timestamp parameter when force refreshing to prevent browser/API caching
      if (forceRefresh) {
        params._t = Date.now();
        // Since this is a forced refresh, we should clear any cached projects first
        console.log('Force refresh requested, clearing cached projects');
      }

      console.log('Calling projectServices.getAll with params:', params);
      const response = await projectServices.getAll(params);
      console.log('API response:', response);
      
      // Reset fetch attempts on success
      fetchAttempts.current = 0;
      
      if (response && response.data) {
        const projectsData = Array.isArray(response.data) ? response.data : 
                            (response.data.data || []);
        console.log('Setting projects state with:', projectsData.length, 'projects');
        setProjects(projectsData);
        
        // Save to localStorage immediately
        localStorage.setItem('cachedProjects', JSON.stringify(projectsData));
        
        // Update the last fetch timestamp
        lastFetchTimestamp.current = Date.now();
        
        // Update the project cache with the latest data
        projectsData.forEach(project => {
          projectCache.current[project._id] = {
            data: project,
            timestamp: Date.now()
          };
        });
        
        return projectsData;
      } else {
        console.error('Invalid response format:', response);
        setProjects([]);
        return [];
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      
      // Handle auth errors with retries
      if (err.response?.status === 401 && fetchAttempts.current < maxRetries) {
        console.log(`Auth error, retrying (${fetchAttempts.current + 1}/${maxRetries})...`);
        fetchAttempts.current += 1;
        
        // Wait a moment before retrying
        setTimeout(() => {
          fetchProjects(true);
        }, 1000);
        
        return [];
      }
      
      const message = err.response?.data?.message || 'Failed to fetch projects';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [filters]); // Dependency on filters, but we now have guards in place

  // Fetch a single project by ID with caching
  const fetchProjectById = async (id) => {
    console.log(`[ProjectContext] Fetching project with id: ${id}`);
    
    // Set loading state only if not in cache or cache is stale
    const cachedProject = projectCache.current[id];
    const now = Date.now();
    const cacheIsValid = cachedProject && (now - cachedProject.timestamp < 60000); // 1 minute cache
    
    if (!cacheIsValid) {
      setLoading(true);
    }
    
    setError('');

    try {
      // Check cache first
      if (cacheIsValid) {
        console.log('[ProjectContext] Using cached project data');
        return cachedProject.data;
      }
      
      const response = await projectServices.getById(id);
      console.log('[ProjectContext] Project fetch response:', response);
      
      if (response && response.data) {
        const projectData = response.data.data || response.data;
        console.log('[ProjectContext] Processed project data:', projectData);
        
        // Update cache
        projectCache.current[id] = {
          data: projectData,
          timestamp: now
        };
        
        return projectData;
      } else {
        console.error('[ProjectContext] Invalid project response format:', response);
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('[ProjectContext] Error fetching project:', err);
      const message = err.response?.data?.message || 'Failed to fetch project';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Add new project
  const addProject = async (projectData) => {
    setLoading(true);
    setError('');
    console.log('Creating new project with data:', projectData);

    try {
      const response = await projectServices.create(projectData);
      console.log('API response for create project:', response);
      
      if (response && response.data) {
        const newProject = response.data.data || response.data;
        
        // Update local cache
        projectCache.current[newProject._id] = {
          data: newProject,
          timestamp: Date.now()
        };
        
        // Update projects array
        setProjects(prevProjects => [...prevProjects, newProject]);
        
        return newProject;
      } else {
        throw new Error('Invalid response format from create API');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      const message = err.response?.data?.message || 'Failed to create project';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update project
  const updateProject = async (id, projectData) => {
    setLoading(true);
    setError('');
    console.log('[ProjectContext] Updating project:', id, projectData);

    try {
      // Ensure we're sending all required fields in the correct format
      const processedData = {
        ...projectData,
        // Ensure arrays are properly formatted
        tags: Array.isArray(projectData.tags) ? projectData.tags : [],
        technologies: Array.isArray(projectData.technologies) ? projectData.technologies : []
      };
      
      const response = await projectServices.update(id, processedData);
      console.log('[ProjectContext] Project update response:', response);
      
      let updatedProject = response.data;
      if (response.data && response.data.data) {
        updatedProject = response.data.data;
      }
      
      console.log('[ProjectContext] Processed updated project:', updatedProject);
      
      // Update cache
      projectCache.current[id] = {
        data: updatedProject,
        timestamp: Date.now()
      };
      
      // Update projects array if it exists in the current list
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project._id === id ? updatedProject : project
        )
      );
      
      return updatedProject;
    } catch (err) {
      console.error('[ProjectContext] Error updating project:', err);
      const message = err.response?.data?.message || 'Failed to update project';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    setLoading(true);
    setError('');

    try {
      await projectServices.delete(id);
      
      // Remove from cache
      delete projectCache.current[id];
      
      // Update projects array
      setProjects(prevProjects => prevProjects.filter(project => project._id !== id));
      
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete project';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Add team member to project
  const addTeamMember = async (projectId, email) => {
    setLoading(true);
    setError('');

    try {
      const response = await projectServices.addTeamMember(projectId, email);
      const updatedProject = response.data.data || response.data;
      
      // Update cache
      projectCache.current[projectId] = {
        data: updatedProject,
        timestamp: Date.now()
      };
      
      // Update projects array
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project._id === projectId ? updatedProject : project
        )
      );
      
      return updatedProject;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add team member';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update filter parameters
  const updateFilters = useCallback((newFilters) => {
    console.log('Updating filters to:', newFilters);
    setFilters(prevFilters => {
      const updatedFilters = {
        ...prevFilters,
        ...newFilters
      };
      
      // Only trigger an update if filters actually changed
      if (haveFiltersChanged(updatedFilters, prevFilters)) {
        return updatedFilters;
      }
      return prevFilters;
    });
  }, []);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      status: '',
      technology: ''
    });
  };
  
  // Clear the project cache
  const clearCache = () => {
    projectCache.current = {};
    lastFetchTimestamp.current = null;
    localStorage.removeItem('cachedProjects');
  };

  const value = {
    projects,
    loading,
    error,
    filters,
    fetchProjects,
    fetchProjectById,
    addProject,
    updateProject,
    deleteProject,
    addTeamMember,
    updateFilters,
    clearFilters,
    clearCache
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;