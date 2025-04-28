import React, { createContext, useState, useEffect, useContext } from 'react';
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
  
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log('ProjectContext: currentUser updated', currentUser);
    if (currentUser) {
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, filters]);

  // Fetch all projects based on filters
  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    console.log('Fetching projects with filters:', filters);

    try {
      // Convert filters to API query params
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.technology) params.technology = filters.technology;

      console.log('Calling projectServices.getAll with params:', params);
      const response = await projectServices.getAll(params);
      console.log('API response:', response);
      
      if (response && response.data) {
        const projectsData = response.data.data || response.data;
        console.log('Setting projects state with:', projectsData);
        setProjects(projectsData);
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

  // Fetch a single project by ID
  const fetchProjectById = async (id) => {
    setLoading(true);
    setError('');
    console.log(`[ProjectContext] Fetching project with id: ${id}`);

    try {
      const response = await projectServices.getById(id);
      console.log('[ProjectContext] Project fetch response:', response);
      
      if (response && response.data) {
        const projectData = response.data.data || response.data;
        console.log('[ProjectContext] Processed project data:', projectData);
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
        setProjects([...projects, newProject]);
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
      
      setProjects(projects.map(project => 
        project._id === id ? updatedProject : project
      ));
      
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
      setProjects(projects.filter(project => project._id !== id));
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
      
      setProjects(projects.map(project => 
        project._id === projectId ? updatedProject : project
      ));
      
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
    clearFilters
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;