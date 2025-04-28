import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Link
} from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200]
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="/innovaite-logo.png"
                alt="InnovAIte Planner"
                height="40"
                style={{ marginRight: '10px' }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={5}>
            <Typography variant="body2" color="text.secondary" align="center">
              © {currentYear} InnovAIte Planner Board. All rights reserved.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2 }}>
              <Link component={RouterLink} to="/" color="inherit">
                Home
              </Link>
              <Link component={RouterLink} to="/about" color="inherit">
                About
              </Link>
              <Link component={RouterLink} to="/privacy" color="inherit">
                Privacy
              </Link>
              <Link
                href="https://github.com/your-username/planner-board"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                GitHub
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;