import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Container } from '@mui/material';

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  // Show loading indicator while checking auth status
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh'
        }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;