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
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import GitHubIcon from '@mui/icons-material/GitHub';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from '../context/AuthContext';

// Status color mapping
const statusColors = {
  'Not Started': 'default',
  'In Progress': 'primary',
  'Completed': 'success'
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
    githubLink
  } = project;

  const formattedDate = deadline ? new Date(deadline).toLocaleDateString() : 'No deadline';
  
  // Check if current user is creator or team member
  const isCreator = creator && currentUser && creator.id === currentUser.id;
  // eslint-disable-next-line no-unused-vars
  const isTeamMember = teamMembers && currentUser && 
    teamMembers.some(member => member.id === currentUser.id);
  
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
        position: 'relative'
      }}
      onClick={handleCardClick}
    >
      {/* Status badge */}
      <Chip
        label={status}
        color={statusColors[status]}
        size="small"
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          fontWeight: 'bold'
        }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
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
        
        {technologies && technologies.length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Technologies:
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
              <IconButton size="small" onClick={handleEditClick}>
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
        </Box>
        
        {(teamMembers && teamMembers.length > 0) && (
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
            {creator && (
              <Tooltip title={`Creator: ${creator.name}`}>
                <Avatar alt={creator.name} src="/static/creator.jpg" />
              </Tooltip>
            )}
            {teamMembers.map((member, index) => (
              <Tooltip key={index} title={member.name}>
                <Avatar alt={member.name} src={`/static/member${index}.jpg`} />
              </Tooltip>
            ))}
          </AvatarGroup>
        )}
      </CardActions>
    </Card>
  );
};

export default ProjectCard;