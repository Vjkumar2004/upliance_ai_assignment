import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Container,
  Paper,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  Visibility as PreviewIcon,
  Add as AddIcon,
  TextFields as TextIcon,
  Numbers as NumberIcon,
  Subject as TextareaIcon,
  List as SelectIcon,
  RadioButtonChecked as RadioIcon,
  CheckBox as CheckboxIcon,
  DateRange as DateIcon,
  Functions as DerivedIcon,
  Build as BuildIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';

import FieldEditor from '../components/FormBuilder/FieldEditor';
import FormRenderer from '../components/FormBuilder/FormRenderer';
import { FIELD_TYPES, getFieldDefaults } from '../components/FormBuilder/FieldTypes';
import { getCurrentFormFromStorage, saveCurrentFormToStorage, saveFormToStorage } from '../utils/formData';
import { FormSchema, FormField } from '../types/form';

const CreateForm: React.FC = () => {
  const [formName, setFormName] = useState<string>('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // Load form from localStorage on mount
  useEffect(() => {
    const savedForm = getCurrentFormFromStorage();
    if (savedForm) {
      setFormName(savedForm.name || '');
      setFields(savedForm.fields || []);
    }
  }, []);

  // Auto-save current form state
  useEffect(() => {
    const autoSave = () => {
      if (formName || fields.length > 0) {
        saveCurrentFormToStorage({ name: formName, fields });
      }
    };

    const timeoutId = setTimeout(autoSave, 1000);
    return () => clearTimeout(timeoutId);
  }, [formName, fields]);

  const addField = (fieldType: string) => {
    const newField = getFieldDefaults(fieldType as any);
    setFields(prev => [...prev, newField]);
  };

  const updateField = (updatedField: FormField) => {
    setFields(prev => prev.map(field => 
      field.id === updatedField.id ? updatedField : field
    ));
  };

  const deleteField = (fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    setFields(prev => {
      const currentIndex = prev.findIndex(field => field.id === fieldId);
      if (currentIndex === -1) return prev;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newFields = [...prev];
      [newFields[currentIndex], newFields[newIndex]] = [newFields[newIndex], newFields[currentIndex]];
      return newFields;
    });
  };

  const handleSaveForm = () => {
    if (!formName.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a name for your form',
        severity: 'error'
      });
      return;
    }

    if (fields.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please add at least one field to your form',
        severity: 'error'
      });
      return;
    }

    const savedForm = saveFormToStorage({ name: formName, fields });
    if (savedForm) {
      setSnackbar({
        open: true,
        message: `"${formName}" has been saved successfully!`,
        severity: 'success'
      });
      setShowSaveDialog(false);
      
      // Clear current form state
      setFormName('');
      setFields([]);
      saveCurrentFormToStorage({ name: '', fields: [] });
    }
  };

  const fieldTypeActions = [
    { icon: <TextIcon />, name: 'Text', action: () => addField(FIELD_TYPES.TEXT) },
    { icon: <NumberIcon />, name: 'Number', action: () => addField(FIELD_TYPES.NUMBER) },
    { icon: <TextareaIcon />, name: 'Textarea', action: () => addField(FIELD_TYPES.TEXTAREA) },
    { icon: <SelectIcon />, name: 'Select', action: () => addField(FIELD_TYPES.SELECT) },
    { icon: <RadioIcon />, name: 'Radio', action: () => addField(FIELD_TYPES.RADIO) },
    { icon: <CheckboxIcon />, name: 'Checkbox', action: () => addField(FIELD_TYPES.CHECKBOX) },
    { icon: <DateIcon />, name: 'Date', action: () => addField(FIELD_TYPES.DATE) },
    { icon: <DerivedIcon />, name: 'Derived', action: () => addField(FIELD_TYPES.DERIVED) }
  ];

  if (previewMode) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Hero Section for Preview */}
          <Paper
            elevation={0}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 4,
              borderRadius: 4,
              mb: 4,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Form Preview
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              See how your form will look to users
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<BuildIcon />}
              onClick={() => setPreviewMode(false)}
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
              Back to Editor
            </Button>
          </Box>

          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <FormRenderer fields={fields} />
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

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
              Create Your Form
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PreviewIcon />}
              onClick={() => setPreviewMode(true)}
              disabled={fields.length === 0}
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
              Preview Form
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<SaveIcon />}
              onClick={() => setShowSaveDialog(true)}
              disabled={!formName.trim() || fields.length === 0}
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
              Save Form
            </Button>
          </Box>
        </Paper>

        {/* Form Name Section */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
          <CardHeader
            title="Form Details"
            subheader="Start by giving your form a name"
            avatar={<PaletteIcon sx={{ color: 'primary.main' }} />}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          />
          <CardContent sx={{ p: 4 }}>
            <TextField
              fullWidth
              label="Form Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter a descriptive name for your form"
              variant="outlined"
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Fields Section */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
          <CardHeader
            title="Form Fields"
            subheader={`${fields.length} field${fields.length !== 1 ? 's' : ''} added`}
            avatar={<BuildIcon sx={{ color: 'secondary.main' }} />}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          />
          <CardContent sx={{ p: 4 }}>
            {fields.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Fields Yet
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Use the floating action button to add your first field
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 2, 
                  flexWrap: 'wrap' 
                }}>
                  {fieldTypeActions.slice(0, 4).map((action) => (
                    <Button
                      key={action.name}
                      variant="outlined"
                      startIcon={action.icon}
                      onClick={action.action}
                      sx={{ borderRadius: 2 }}
                    >
                      {action.name}
                    </Button>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box>
                {fields.map((field, index) => (
                  <Box key={field.id}>
                    <FieldEditor
                      field={field}
                      onUpdate={updateField}
                      onDelete={deleteField}
                      onMove={moveField}
                      allFields={fields}
                      index={index}
                      totalFields={fields.length}
                    />
                    {index < fields.length - 1 && (
                      <Divider sx={{ my: 2, opacity: 0.3 }} />
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Add Field Speed Dial */}
        <SpeedDial
          ariaLabel="Add field"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            '& .MuiFab-primary': {
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }
          }}
          icon={<SpeedDialIcon />}
        >
          {fieldTypeActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.action}
            />
          ))}
        </SpeedDial>

        {/* Save Dialog */}
        <Dialog 
          open={showSaveDialog} 
          onClose={() => setShowSaveDialog(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SaveIcon sx={{ color: 'primary.main' }} />
              Save Form
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to save "{formName}"? This will add it to your saved forms.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setShowSaveDialog(false)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveForm} 
              variant="contained" 
              startIcon={<SaveIcon />}
              sx={{ borderRadius: 2 }}
            >
              Save Form
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

export default CreateForm;
