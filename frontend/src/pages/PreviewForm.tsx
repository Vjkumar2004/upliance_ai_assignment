import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Paper,
  Container
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  CheckCircle as SuccessIcon,
  Visibility as PreviewIcon,
  Build as BuildIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import FormRenderer from '../components/FormBuilder/FormRenderer';
import { getCurrentFormFromStorage } from '../utils/formData';
import { FormSchema, FormValues } from '../types/form';

const PreviewForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormSchema | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const currentForm = getCurrentFormFromStorage();
    if (currentForm && currentForm.fields && currentForm.fields.length > 0) {
      setForm(currentForm);
    } else {
      setSnackbar({
        open: true,
        message: 'No form found to preview. Please create a form first.',
        severity: 'error'
      });
    }
  }, []);

  const handleFormSubmit = (data: FormValues) => {
    console.log('Form submitted with data:', data);
    
    // Comprehensive validation report
    const validationReport = {
      totalFields: form?.fields?.length || 0,
      filledFields: Object.keys(data).filter(key => {
        const value = data[key];
        return value !== undefined && value !== null && value !== '' && 
               (Array.isArray(value) ? value.length > 0 : true);
      }).length,
      validationStatus: 'All requirements met!',
      formData: data,
      timestamp: new Date().toISOString()
    };
    
    console.log('Validation Report:', validationReport);
    
    setSnackbar({
      open: true,
      message: `✅ Form submitted successfully! ${validationReport.filledFields}/${validationReport.totalFields} fields completed.`,
      severity: 'success'
    });
  };

  if (!form || !form.fields || form.fields.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Hero Section */}
          <Paper
            elevation={0}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 6,
              borderRadius: 4,
              mb: 6,
              textAlign: 'center'
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Form Preview
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                See how your form will look to users before publishing. 
                Test the user experience and validation.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<BuildIcon />}
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
              Create Form
            </Button>
          </Paper>
          
          {/* Empty State */}
          <Card sx={{ borderRadius: 3, boxShadow: 2, textAlign: 'center' }}>
            <CardContent sx={{ p: 8 }}>
              <PreviewIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3, opacity: 0.5 }} />
              <Typography variant="h4" color="text.secondary" gutterBottom>
                No Form to Preview
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                Please create a form first to preview it here. You can build forms with various field types and validation rules.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<BuildIcon />}
                onClick={() => navigate('/create')}
                sx={{ borderRadius: 2, px: 4, py: 1.5 }}
              >
                Create Form
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Back Button - Top Left */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<BackIcon />}
            onClick={() => navigate('/')}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'primary.light',
                color: 'primary.dark'
              }
            }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 6,
            borderRadius: 4,
            mb: 6,
            textAlign: 'center'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Form Preview
            </Typography>
            {form.name && (
              <Typography variant="h4" sx={{ opacity: 0.9, mb: 2 }}>
                {form.name}
              </Typography>
            )}
            <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
              See how your form will look to users. Test the user experience and validation rules.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="large"
            startIcon={<BackIcon />}
            onClick={() => navigate('/create')}
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
            Back to Editor
          </Button>
        </Paper>

        {/* Form Preview */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <FormRenderer
              fields={form.fields}
              onSubmit={handleFormSubmit}
              showValidation={true}
            />
          </CardContent>
        </Card>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default PreviewForm;
