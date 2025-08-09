import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  CheckCircle as SuccessIcon
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
    setSnackbar({
      open: true,
      message: 'Form submitted successfully!',
      severity: 'success'
    });
  };

  if (!form || !form.fields || form.fields.length === 0) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Preview Form
          </Typography>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => navigate('/create')}
          >
            Back to Create
          </Button>
        </Box>
        
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Form to Preview
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Please create a form first to preview it here.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/create')}
          >
            Create Form
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Preview Form
          </Typography>
          {form.name && (
            <Typography variant="h6" color="text.secondary">
              {form.name}
            </Typography>
          )}
        </Box>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/create')}
        >
          Back to Create
        </Button>
      </Box>

      <FormRenderer
        fields={form.fields}
        onSubmit={handleFormSubmit}
        showValidation={true}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PreviewForm;
