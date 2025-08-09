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
  SpeedDialIcon
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
  Functions as DerivedIcon
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
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Preview Form
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={() => setPreviewMode(false)}
          >
            Back to Editor
          </Button>
        </Box>
        <FormRenderer fields={fields} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Create Form
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={() => setPreviewMode(true)}
            disabled={fields.length === 0}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => setShowSaveDialog(true)}
            disabled={!formName.trim() || fields.length === 0}
          >
            Save Form
          </Button>
        </Box>
      </Box>

      {/* Form Name */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter form name"
            variant="outlined"
            size="medium"
          />
        </CardContent>
      </Card>

      {/* Fields */}
      <Box sx={{ mb: 3 }}>
        {fields.map((field, index) => (
          <FieldEditor
            key={field.id}
            field={field}
            onUpdate={updateField}
            onDelete={deleteField}
            onMove={moveField}
            allFields={fields}
            index={index}
            totalFields={fields.length}
          />
        ))}
      </Box>

      {/* Add Field Speed Dial */}
      <SpeedDial
        ariaLabel="Add field"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
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
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to save "{formName}"? This will add it to your saved forms.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} variant="contained" startIcon={<SaveIcon />}>
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateForm;
