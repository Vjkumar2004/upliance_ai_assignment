import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Paper
} from '@mui/material';
import {
  Create as CreateIcon,
  List as ListIcon,
  Build as BuildIcon,
  CheckCircle as CheckIcon,
  Bolt as BoltIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BuildIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Drag & Drop Builder',
      description: 'Intuitive form creation with visual field editor and real-time preview'
    },
    {
      icon: <CheckIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Smart Validation',
      description: 'Built-in validation rules with custom error messages and real-time feedback'
    },
    {
      icon: <BoltIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Derived Fields',
      description: 'Create calculated fields that automatically update based on other form inputs'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', py: 4 }}>
        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 6,
            borderRadius: 4,
            mb: 6
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Dynamic Form Builder
            </Typography>
          
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CreateIcon />}
              onClick={() => navigate('/create')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Create New Form
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ListIcon />}
              onClick={() => navigate('/myforms')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              View My Forms
            </Button>
          </Box>
        </Paper>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footer */}
        <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Built with React, TypeScript, and Material UI
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
