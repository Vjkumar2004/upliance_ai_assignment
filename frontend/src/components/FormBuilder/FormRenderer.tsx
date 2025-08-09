import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Alert,
  Button,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Parser } from 'expr-eval';

import { FormField, FormValues, ValidationError } from '../../types/form';
import { FIELD_TYPES } from './FieldTypes';

interface FormRendererProps {
  fields: FormField[];
  onSubmit?: (data: FormValues) => void;
  initialData?: FormValues;
  showValidation?: boolean;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  fields,
  onSubmit,
  initialData = {},
  showValidation = true
}) => {
  const [formData, setFormData] = useState<FormValues>(initialData);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Initialize form data with default values
  useEffect(() => {
    const defaultData: FormValues = {};
    fields.forEach(field => {
      if (field.defaultValue && !(field.id in formData)) {
        defaultData[field.id] = field.defaultValue;
      }
    });
    if (Object.keys(defaultData).length > 0) {
      setFormData(prev => ({ ...prev, ...defaultData }));
    }
  }, [fields]);

  // Calculate derived fields when parent fields change
  useEffect(() => {
    const derivedFields = fields.filter(f => f.type === FIELD_TYPES.DERIVED);
    derivedFields.forEach(field => {
      if (field.parentFields && field.formula) {
        try {
          const parser = new Parser();
          const variables: { [key: string]: any } = {};
          
          field.parentFields.forEach(parentId => {
            const parentValue = formData[parentId];
            if (parentValue !== undefined) {
              variables[parentId] = parseFloat(parentValue.toString()) || 0;
            }
          });
          
          const result = parser.evaluate(field.formula, variables);
          setFormData(prev => ({ ...prev, [field.id]: result.toString() }));
        } catch (error) {
          console.error('Error evaluating derived field:', error);
        }
      }
    });
  }, [formData, fields]);

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return 'This field is required';
    }

    if (!value || value.toString().trim() === '') return null;

    for (const validation of field.validations) {
      switch (validation.type) {
        case 'minLength':
          if (value.toString().length < parseInt(validation.value)) {
            return `Minimum length is ${validation.value} characters`;
          }
          break;
        case 'maxLength':
          if (value.toString().length > parseInt(validation.value)) {
            return `Maximum length is ${validation.value} characters`;
          }
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.toString())) {
            return 'Please enter a valid email address';
          }
          break;
        case 'password':
          if (value.toString().length < 8) {
            return 'Password must be at least 8 characters long';
          }
          break;
      }
    }
    return null;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    setTouched(prev => new Set(prev).add(fieldId));
    
    // Clear error for this field
    setErrors(prev => prev.filter(error => error.fieldId !== fieldId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: ValidationError[] = [];
    fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors.push({ fieldId: field.id, message: error });
      }
    });
    
    setErrors(newErrors);
    
    if (newErrors.length === 0 && onSubmit) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    const error = errors.find(e => e.fieldId === field.id);
    const value = formData[field.id] || '';
    const isTouched = touched.has(field.id);

    switch (field.type) {
      case FIELD_TYPES.TEXT:
      case FIELD_TYPES.EMAIL:
      case FIELD_TYPES.PASSWORD:
        return (
          <TextField
            key={field.id}
            fullWidth
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={isTouched && !!error}
            helperText={isTouched && error ? error.message : ''}
            required={field.required}
            margin="normal"
          />
        );

      case FIELD_TYPES.NUMBER:
        return (
          <TextField
            key={field.id}
            fullWidth
            type="number"
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={isTouched && !!error}
            helperText={isTouched && error ? error.message : ''}
            required={field.required}
            margin="normal"
          />
        );

      case FIELD_TYPES.TEXTAREA:
        return (
          <TextField
            key={field.id}
            fullWidth
            multiline
            rows={4}
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={isTouched && !!error}
            helperText={isTouched && error ? error.message : ''}
            required={field.required}
            margin="normal"
          />
        );

      case FIELD_TYPES.SELECT:
        return (
          <FormControl key={field.id} fullWidth margin="normal" required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              label={field.label}
              error={isTouched && !!error}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {isTouched && error && (
              <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                {error.message}
              </Typography>
            )}
          </FormControl>
        );

      case FIELD_TYPES.RADIO:
        return (
          <FormControl key={field.id} component="fieldset" margin="normal" required={field.required}>
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {isTouched && error && (
              <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                {error.message}
              </Typography>
            )}
          </FormControl>
        );

      case FIELD_TYPES.CHECKBOX:
        return (
          <FormControlLabel
            key={field.id}
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              />
            }
            label={field.label}
          />
        );

      case FIELD_TYPES.DATE:
        return (
          <DatePicker
            key={field.id}
            label={field.label}
            value={value && typeof value !== 'boolean' ? new Date(value) : null}
            onChange={(date) => handleFieldChange(field.id, date)}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                required: field.required,
                error: isTouched && !!error,
                helperText: isTouched && error ? error.message : ''
              }
            }}
          />
        );

      case FIELD_TYPES.DERIVED:
        return (
          <TextField
            key={field.id}
            fullWidth
            label={field.label}
            value={value}
            InputProps={{ readOnly: true }}
            margin="normal"
            helperText={`Calculated from: ${field.formula}`}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Form
        </Typography>
        
        {errors.length > 0 && showValidation && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Please fix the following errors:
            <ul>
              {errors.map((error) => (
                <li key={error.fieldId}>{error.message}</li>
              ))}
            </ul>
          </Alert>
        )}

        {fields.map(renderField)}

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Submit
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() => setFormData({})}
          >
            Reset
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormRenderer;
