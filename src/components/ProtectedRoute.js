import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Container } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  console.log('[ProtectedRoute] Rendering, checking auth status');
  const { currentUser, loading } = useAuth();
  
  console.log('[ProtectedRoute] Auth state:', { currentUser: !!currentUser, loading });

  // Show loading indicator while checking auth status
  if (loading) {
    console.log('[ProtectedRoute] Still loading auth status, showing spinner');
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
    console.log('[ProtectedRoute] No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Render the children (protected content)
  console.log('[ProtectedRoute] User authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;