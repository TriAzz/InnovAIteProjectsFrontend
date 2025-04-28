import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          About InnovAIte
        </Typography>

        {/* Executive Summary */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Executive Summary
          </Typography>
          <Typography variant="body1" paragraph>
            We are InnovAIte, a new Capstone Company which aims to trial and validate different AI tools and methods 
            to find out how they can be used to assist entrepreneurship programs Deakin is launching in 2026. 
            Our mission is to understand how AI tools and platforms can ease the startup development cycle in 2 ways: 
            both by significantly shortening the development cycle, and by limiting the amount of technical expertise required.
          </Typography>
          <Typography variant="body1" paragraph>
            This is performed in 2 phases. Phase 1 involves familiarising ourselves with different AI tools 
            and developing an understanding of each tool's capabilities. Phase 2 demonstrates our understanding 
            by applying our knowledge to swiftly create small projects.
          </Typography>
        </Box>

        {/* Leadership Team */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Leadership Team
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>LY</Avatar>
                    <Box>
                      <Typography variant="h6">Dr. Leon Yang</Typography>
                      <Typography variant="subtitle2" color="text.secondary">Acting Director</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>JM</Avatar>
                    <Box>
                      <Typography variant="h6">Jesse McMeikan</Typography>
                      <Typography variant="subtitle2" color="text.secondary">Product Owner</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>SW</Avatar>
                    <Box>
                      <Typography variant="h6">Scott West</Typography>
                      <Typography variant="subtitle2" color="text.secondary">Industry Mentor</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Team Leads */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Leadership Teams</Typography>

          <Grid container spacing={4}>
            {/* Code Integration Leads */}
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Code Integration Leads</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Pooja Dissanayake" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Aneesh Sameer Pedram" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Hariharan Tandullu Ramesh" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Pratham Shelar" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Jay Shrimpton" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Comms Leads */}
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Comms Leads</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Thomas John Fleming" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Maryam Khazaeepool" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Lakshay Lalia" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Ahmad Tahir Chaudhry" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Ibram Milad Zaki Ghali" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Nihar Jalela" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Sprint Leads */}
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Sprint Leads</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Aamya Gupta" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Negin Pakroohjahromi" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Jay Shrimpton" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Aryan Sharma" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Goals and Objectives */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Trimester Goals and Objectives
          </Typography>
          <Typography variant="body1" paragraph>
            InnovAIte operates with three core functional areas (The Three C's):
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Code" 
                secondary="Repository management and technical integration" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Communication" 
                secondary="Information flow and documentation" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Coordination" 
                secondary="Project planning and sprint management" 
              />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph>
            Students' skills in each of these areas are demonstrated by contributing to the projects and/or leadership team duties.
          </Typography>
        </Box>

        {/* Project Goals */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Project Goals
          </Typography>
          <Typography variant="body1" paragraph>
            The workload of the company is structured around a 12-week student-led exploration program divided into two main phases:
          </Typography>
          
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">Phase 1: (Completed)</Typography>
              <Typography variant="body1">
                Investigation, Resource Development & Knowledge Building (Weeks 1-5) - Focus on tool exploration, 
                workshop and education framework development, and knowledge sharing.
              </Typography>
            </CardContent>
          </Card>
          
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6">Phase 2:</Typography>
              <Typography variant="body1">
                Applied Challenges, Communication Engagement and Impact Management (Weeks 6-12) – Focus on applying 
                knowledge developed in phase 1 to experiment with creating projects using AI, as well as further researching 
                how our knowledge can be used to further the InnovAIte 2026 project.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* InnovAIte Projects Platform */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            About InnovAIte Projects
          </Typography>
          <Typography variant="body1" paragraph>
            InnovAIte Projects is a collaborative platform where team members can share, track, and manage 
            project ideas throughout their development lifecycle. This platform serves as a central hub for:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Project Ideation" 
                secondary="A place to submit new project concepts and innovative ideas before they begin development" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Progress Tracking" 
                secondary="Monitor and share updates on in-progress projects, allowing for transparency and collaboration" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Showcase" 
                secondary="Highlight completed projects and their outcomes to demonstrate the capabilities of AI-assisted development" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Knowledge Repository" 
                secondary="Document learnings, techniques, and best practices from various AI tools explorations" 
              />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph>
            The platform encourages cross-functional collaboration and knowledge sharing among all InnovAIte teams, 
            helping to accelerate innovation and providing valuable insights for Deakin's 2026 entrepreneurship programs.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default About;