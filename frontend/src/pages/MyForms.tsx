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
  ListItemSecondaryAction,
  Container,
  Divider
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Folder as FolderIcon,
  Description as FormIcon,
  ArrowBack as BackIcon
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
                My Forms
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                Manage and organize all your created forms in one place. 
                View, edit, and share your forms with ease.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
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
              Create Your First Form
            </Button>
          </Paper>
          
          {/* Empty State */}
          <Card sx={{ borderRadius: 3, boxShadow: 2, textAlign: 'center' }}>
            <CardContent sx={{ p: 8 }}>
              <FolderIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3, opacity: 0.5 }} />
              <Typography variant="h4" color="text.secondary" gutterBottom>
                No Forms Yet
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                You haven't created any forms yet. Start building your first form to get started!
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create')}
                sx={{ borderRadius: 2, px: 4, py: 1.5 }}
              >
                Create Your First Form
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
              My Forms
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              Manage and organize all your created forms in one place. 
              View, edit, and share your forms with ease.
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
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
        </Paper>

        {/* Forms Grid */}
        <Grid container spacing={4}>
          {forms.map((form) => (
            <Grid item xs={12} md={6} lg={4} key={form.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}>
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FormIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {form.name}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`} 
                      size="small" 
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <CalendarIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Created {formatDate(form.createdAt || new Date())}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {form.fields.length > 0 
                      ? `Contains ${form.fields.length} field${form.fields.length === 1 ? '' : 's'} with various input types and validation rules.`
                      : 'No fields defined yet.'
                    }
                  </Typography>
                </CardContent>
                
                <Divider sx={{ opacity: 0.3 }} />
                <CardActions sx={{ p: 3, pt: 2 }}>
                  <Button
                    size="medium"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewForm(form)}
                    sx={{ borderRadius: 2, flex: 1 }}
                  >
                    View
                  </Button>
                  <Button
                    size="medium"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditForm(form)}
                    sx={{ borderRadius: 2, flex: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="medium"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteForm(form)}
                    sx={{ borderRadius: 2, flex: 1 }}
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
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ViewIcon sx={{ color: 'primary.main' }} />
              {selectedForm?.name} - Preview
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {selectedForm && (
              <FormRenderer
                fields={selectedForm.fields}
                onSubmit={handleFormSubmit}
                showValidation={true}
              />
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setShowPreviewDialog(false)}
              sx={{ borderRadius: 2 }}
            >
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
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DeleteIcon sx={{ color: 'error.main' }} />
              Delete Form
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{formToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setShowDeleteDialog(false)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              color="error" 
              variant="contained"
              sx={{ borderRadius: 2 }}
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
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default MyForms;
