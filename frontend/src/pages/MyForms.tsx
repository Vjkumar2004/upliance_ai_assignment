import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import FormRenderer from '../components/FormBuilder/FormRenderer';
import { getSavedFormsFromStorage } from '../utils/formData';
import { FormSchema, FormValues } from '../types/form';

const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormSchema[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormSchema | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formToDelete, setFormToDelete] = useState<FormSchema | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = () => {
    const savedForms = getSavedFormsFromStorage();
    setForms(savedForms);
  };

  const handleViewForm = (form: FormSchema) => {
    setSelectedForm(form);
    setShowPreviewDialog(true);
  };

  const handleEditForm = (form: FormSchema) => {
    // For now, we'll just navigate to create with a message
    // In a real app, you'd load the form into the editor
    navigate('/create');
    setSnackbar({
      open: true,
      message: 'Edit functionality coming soon!',
      severity: 'success'
    });
  };

  const handleDeleteForm = (form: FormSchema) => {
    setFormToDelete(form);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (formToDelete) {
      try {
        const updatedForms = forms.filter(f => f.id !== formToDelete.id);
        localStorage.setItem('savedForms', JSON.stringify(updatedForms));
        setForms(updatedForms);
        setSnackbar({
          open: true,
          message: `"${formToDelete.name}" has been deleted successfully!`,
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error deleting form',
          severity: 'error'
        });
      }
      setShowDeleteDialog(false);
      setFormToDelete(null);
    }
  };

  const handleFormSubmit = (data: FormValues) => {
    console.log('Form submitted with data:', data);
    setSnackbar({
      open: true,
      message: 'Form submitted successfully!',
      severity: 'success'
    });
    setShowPreviewDialog(false);
  };

  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  if (forms.length === 0) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            My Forms
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create')}
          >
            Create New Form
          </Button>
        </Box>
        
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Forms Yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            You haven't created any forms yet. Start building your first form!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create')}
          >
            Create Your First Form
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Forms
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create')}
        >
          Create New Form
        </Button>
      </Box>

      <Grid container spacing={3}>
        {forms.map((form) => (
          <Grid item xs={12} md={6} lg={4} key={form.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {form.name}
                  </Typography>
                  <Chip 
                    label={`${form.fields.length} fields`} 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Created {formatDate(form.createdAt || new Date())}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {form.fields.length > 0 
                    ? `Contains ${form.fields.length} field${form.fields.length === 1 ? '' : 's'}`
                    : 'No fields defined'
                  }
                </Typography>
              </CardContent>
              
              <CardActions sx={{ pt: 0 }}>
                <Button
                  size="small"
                  startIcon={<ViewIcon />}
                  onClick={() => handleViewForm(form)}
                >
                  View
                </Button>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditForm(form)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteForm(form)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={showPreviewDialog}
        onClose={() => setShowPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedForm?.name} - Preview
        </DialogTitle>
        <DialogContent>
          {selectedForm && (
            <FormRenderer
              fields={selectedForm.fields}
              onSubmit={handleFormSubmit}
              showValidation={true}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreviewDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{formToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default MyForms;
