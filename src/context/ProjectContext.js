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
  
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filters]);

  // Fetch all projects based on filters
  const fetchProjects = async () => {
    setLoading(true);
    setError('');

    try {
      // Convert filters to API query params
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.technology) params.technology = filters.technology;

      const response = await projectServices.getAllProjects(params);
      setProjects(response.data.data);
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch projects';
      setError(message);
      console.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single project by ID
  const fetchProjectById = async (id) => {
    setLoading(true);
    setError('');

    try {
      const response = await projectServices.getProject(id);
      return response.data.data;
    } catch (err) {
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

    try {
      const response = await projectServices.createProject(projectData);
      setProjects([...projects, response.data.data]);
      return response.data.data;
    } catch (err) {
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
      const response = await projectServices.updateProject(id, projectData);
      const updatedProject = response.data.data;
      
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
      await projectServices.deleteProject(id);
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
      const updatedProject = response.data.data;
      
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