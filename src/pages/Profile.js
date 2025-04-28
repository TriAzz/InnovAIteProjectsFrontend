import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { projects } = useProjects();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Get user's projects (created by the user)
  const userProjects = projects.filter(project => 
    project.creator && project.creator.id === currentUser.id
  );
  
  // Get projects where user is a team member
  const teamProjects = projects.filter(project => 
    project.teamMembers && project.teamMembers.some(member => member.id === currentUser.id)
  );
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    // Password update validation
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        return setMessage({ 
          type: 'error', 
          text: 'Please enter your current password'
        });
      }
      
      if (formData.newPassword.length < 6) {
        return setMessage({
          type: 'error',
          text: 'New password must be at least 6 characters'
        });
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        return setMessage({
          type: 'error',
          text: 'New passwords do not match'
        });
      }
    }
    
    setUpdating(true);
    
    // In a real application, this would call an API to update the user profile
    // For now, we'll just simulate a successful update
    setTimeout(() => {
      setMessage({
        type: 'success',
        text: 'Profile updated successfully'
      });
      setUpdating(false);
      
      // Clear password fields after update
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }, 1000);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 3
            }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem'
                }}
              >
                {currentUser?.name?.charAt(0).toUpperCase() || <PersonIcon fontSize="large" />}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {currentUser?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {currentUser?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Role: {currentUser?.role || 'User'}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Statistics
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Projects Created" 
                    secondary={userProjects.length} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Team Memberships" 
                    secondary={teamProjects.length} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Account Created" 
                    secondary={new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()} 
                  />
                </ListItem>
              </List>
            </Box>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Edit Profile
            </Typography>
            
            {message.text && (
              <Alert severity={message.type} sx={{ mb: 3 }}>
                {message.text}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled // Email changes might require verification, so disabling for now
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="body2" color="text.secondary">
                      Change Password (Optional)
                    </Typography>
                  </Divider>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={updating}
                >
                  {updating ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </Paper>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Your Projects
            </Typography>
            
            <Grid container spacing={2}>
              {userProjects.length > 0 ? (
                userProjects.slice(0, 3).map(project => (
                  <Grid item xs={12} sm={6} md={4} key={project._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" noWrap>
                          {project.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {project.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {project.category}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {project.status}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Alert severity="info">
                    You haven't created any projects yet.
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;