import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Avatar,
  AvatarGroup,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import GitHubIcon from '@mui/icons-material/GitHub';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import LanguageIcon from '@mui/icons-material/Language';
import { useAuth } from '../context/AuthContext';

// Status color mapping
const statusColors = {
  'Not Started': 'default',
  'In Progress': 'primary',
  'Completed': 'success',
  'On Hold': 'warning'
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const {
    _id,
    title,
    description,
    status,
    category,
    technologies,
    // eslint-disable-next-line no-unused-vars
    tags,
    creator,
    teamMembers,
    deadline,
    githubLink,
    liveSiteUrl
  } = project;

  const formattedDate = deadline ? new Date(deadline).toLocaleDateString() : 'No deadline';
  
  // Fixed: Improved creator check logic to reliably identify if the current user is the creator
  const isCreator = currentUser && creator && (
    // Check all possible ID formats
    (creator._id && currentUser._id && creator._id === currentUser._id) || 
    (creator._id && currentUser.id && creator._id === currentUser.id) || 
    (creator.id && currentUser._id && creator.id === currentUser._id) || 
    (creator.id && currentUser.id && creator.id === currentUser.id) ||
    // Also check by email for extra reliability
    (creator.email && currentUser.email && creator.email === currentUser.email)
  );
  
  const isTeamMember = teamMembers && currentUser && 
    teamMembers.some(member => 
      member._id === currentUser._id || 
      member._id === currentUser.id || 
      member.id === currentUser._id || 
      member.id === currentUser.id ||
      member.email === currentUser.email
    );
  
  const handleCardClick = () => {
    navigate(`/projects/${_id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/projects/${_id}?edit=true`);
  };

  const handleGithubClick = (e) => {
    e.stopPropagation();
    if (githubLink) {
      window.open(githubLink, '_blank');
    }
  };
  
  const handleLiveSiteClick = (e) => {
    e.stopPropagation();
    if (liveSiteUrl) {
      // Ensure URL has proper protocol
      let url = liveSiteUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      console.log('Opening live site URL:', url);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // For debugging
  console.log('ProjectCard detailed ownership check:', {
    projectId: _id,
    projectTitle: title,
    creator: creator ? {
      id: creator.id, 
      _id: creator._id,
      email: creator.email
    } : 'No creator',
    currentUser: currentUser ? {
      id: currentUser.id, 
      _id: currentUser._id,
      email: currentUser.email
    } : 'Not logged in',
    matchByObjectId: creator && currentUser && creator._id === currentUser._id,
    matchById: creator && currentUser && creator.id === currentUser.id,
    matchByEmail: creator && currentUser && creator.email === currentUser.email,
    isCreator
  });

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6,
        },
        position: 'relative',
        // Add subtle highlighting for owned projects
        border: isCreator ? '1px solid #1976d2' : 'none',
      }}
      onClick={handleCardClick}
    >
      {/* Status badge */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: 10, right: 10, left: 10 }}>
        {/* Owner indicator */}
        {isCreator && (
          <Chip
            icon={<PersonIcon sx={{ fontSize: '0.8rem' }} />}
            label="Your Project"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ height: 24 }}
          />
        )}
        <Chip
          label={status}
          color={statusColors[status]}
          size="small"
          sx={{
            fontWeight: 'bold'
          }}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, pt: isCreator ? 5 : 4 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {description}
        </Typography>
        
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Category:
          </Typography>
          <Chip label={category} size="small" />
        </Box>
        
        {/* Creator display with enhanced styling */}
        {creator && creator.name && (
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Created by:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 24, 
                  height: 24, 
                  fontSize: '0.75rem',
                  marginRight: 1,
                  backgroundColor: isCreator ? 'primary.main' : 'grey.400'
                }} 
                alt={creator.name}
              >
                {creator.name[0].toUpperCase()}
              </Avatar>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: isCreator ? 600 : 400,
                  color: isCreator ? 'primary.main' : 'text.primary'
                }}
              >
                {creator.name} {isCreator && '(You)'}
              </Typography>
            </Box>
          </Box>
        )}
        
        {technologies && technologies.length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Tools:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {technologies.slice(0, 3).map((tech, index) => (
                <Chip key={index} label={tech} size="small" variant="outlined" />
              ))}
              {technologies.length > 3 && (
                <Chip label={`+${technologies.length - 3}`} size="small" variant="outlined" />
              )}
            </Box>
          </Box>
        )}
        
        {deadline && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="caption">{formattedDate}</Typography>
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          {isCreator && (
            <Tooltip title="Edit Project">
              <IconButton size="small" onClick={handleEditClick} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {githubLink && (
            <Tooltip title="View GitHub Repository">
              <IconButton size="small" onClick={handleGithubClick}>
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {liveSiteUrl && (
            <Tooltip title="View Live Site">
              <IconButton size="small" onClick={handleLiveSiteClick}>
                <LanguageIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        {(teamMembers && teamMembers.length > 0) && (
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
            {teamMembers.map((member, index) => (
              <Tooltip key={index} title={member.name}>
                <Avatar 
                  alt={member.name} 
                  sx={{ bgcolor: member.id === currentUser?.id ? 'primary.main' : 'grey.400' }}
                >
                  {member.name[0].toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
        )}
      </CardActions>
    </Card>
  );
};

export default ProjectCard;