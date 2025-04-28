import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { projectServices } from '../services/api';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
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
  
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log('ProjectContext: currentUser updated', currentUser);
    if (currentUser) {
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, filters]);

  // Fetch all projects based on filters
  const fetchProjects = async (forceRefresh = false) => {
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
      
      // Add a timestamp to bypass cache when force refreshing
      if (forceRefresh) params._t = Date.now();

      console.log('Calling projectServices.getAll with params:', params);
      const response = await projectServices.getAll(params);
      console.log('API response:', response);
      
      if (response && response.data) {
        const projectsData = response.data.data || response.data;
        console.log('Setting projects state with:', projectsData);
        setProjects(projectsData);
        
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
      const message = err.response?.data?.message || 'Failed to fetch projects';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

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

    try {
      const response = await projectServices.update(id, projectData);
      const updatedProject = response.data.data || response.data;
      
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
  const updateFilters = (newFilters) => {
    console.log('Updating filters to:', newFilters);
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

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