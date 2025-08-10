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
  Paper,
  FormGroup
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
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [validationResults, setValidationResults] = useState<{ fieldId: string; label: string; isValid: boolean; message?: string }[]>([]);

  // Initialize form data with default values
  useEffect(() => {
    const defaultData: FormValues = {};
    fields.forEach(field => {
      if (!(field.id in formData)) {
        if (field.defaultValue) {
          defaultData[field.id] = field.defaultValue;
        } else if (field.type === FIELD_TYPES.CHECKBOX && field.options && field.options.length > 0) {
          // Initialize checkbox fields with options as empty arrays
          defaultData[field.id] = [];
        }
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
    if (field.required) {
      if (field.type === FIELD_TYPES.CHECKBOX && field.options && field.options.length > 0) {
        // For checkbox fields with options, check if at least one option is selected
        if (!Array.isArray(value) || value.length === 0) {
          return 'This field is required';
        }
      } else if (!value || value.toString().trim() === '') {
        return 'This field is required';
      }
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
    const newValidationResults: { fieldId: string; label: string; isValid: boolean; message?: string }[] = [];
    
    fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      const isValid = !error;
      
      newValidationResults.push({
        fieldId: field.id,
        label: field.label,
        isValid,
        message: error || 'Valid'
      });
      
      if (error) {
        newErrors.push({ fieldId: field.id, message: error });
      }
    });
    
    setErrors(newErrors);
    setValidationResults(newValidationResults);
    setShowValidationSummary(true);
    
    // Show comprehensive validation results
    if (newErrors.length === 0) {
      // All validations passed
      if (onSubmit) {
        onSubmit(formData);
      }
    } else {
      // Show detailed validation report
      console.log('Validation Report:', newValidationResults);
      console.log('Form Data:', formData);
      console.log('Errors:', newErrors);
    }
  };

  const renderField = (field: FormField) => {
    const error = errors.find(e => e.fieldId === field.id);
    const value = formData[field.id];
    const isTouched = touched.has(field.id);

    const commonFieldProps = {
      sx: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main'
          }
        }
      }
    };

    switch (field.type) {
      case FIELD_TYPES.TEXT:
      case FIELD_TYPES.EMAIL:
      case FIELD_TYPES.PASSWORD:
        return (
          <TextField
            key={field.id}
            fullWidth
            label={field.label}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={isTouched && !!error}
            helperText={isTouched && error ? error.message : ''}
            required={field.required}
            margin="normal"
            size="medium"
            {...commonFieldProps}
          />
        );

      case FIELD_TYPES.NUMBER:
        return (
          <TextField
            key={field.id}
            fullWidth
            type="number"
            label={field.label}
            value={typeof value === 'string' || typeof value === 'number' ? value : ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={isTouched && !!error}
            helperText={isTouched && error ? error.message : ''}
            required={field.required}
            margin="normal"
            size="medium"
            {...commonFieldProps}
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
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={isTouched && !!error}
            helperText={isTouched && error ? error.message : ''}
            required={field.required}
            margin="normal"
            size="medium"
            {...commonFieldProps}
          />
        );

      case FIELD_TYPES.SELECT:
        return (
          <FormControl key={field.id} fullWidth margin="normal" required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              label={field.label}
              error={isTouched && !!error}
              size="medium"
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main'
                }
              }}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {isTouched && error && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                {error.message}
              </Typography>
            )}
          </FormControl>
        );

      case FIELD_TYPES.RADIO:
        return (
          <FormControl key={field.id} component="fieldset" margin="normal" required={field.required}>
            <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
              {field.label}
            </FormLabel>
            <RadioGroup
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              sx={{ ml: 1 }}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio sx={{ '&.Mui-checked': { color: 'primary.main' } }} />}
                  label={option.label}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
            {isTouched && error && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                {error.message}
              </Typography>
            )}
          </FormControl>
        );

      case FIELD_TYPES.CHECKBOX:
        // If checkbox has options, render multiple checkboxes
        if (field.options && field.options.length > 0) {
          return (
            <Box key={field.id} sx={{ mb: 3 }}>
              <FormLabel 
                component="legend" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 1,
                  color: 'text.primary'
                }}
              >
                {field.label}
                {field.required && <span style={{ color: 'error.main' }}> *</span>}
              </FormLabel>
              <FormGroup>
                {field.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={Array.isArray(value) ? value.includes(option.value) : false}
                        onChange={(e) => {
                          const currentValues = Array.isArray(value) ? [...value] : [];
                          if (e.target.checked) {
                            if (!currentValues.includes(option.value)) {
                              handleFieldChange(field.id, [...currentValues, option.value]);
                            }
                          } else {
                            handleFieldChange(field.id, currentValues.filter(v => v !== option.value));
                          }
                        }}
                        sx={{ '&.Mui-checked': { color: 'primary.main' } }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {option.label || option.value}
                      </Typography>
                    }
                    sx={{ 
                      mb: 1,
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'grey.50'
                      }
                    }}
                  />
                ))}
              </FormGroup>
              {isTouched && error && (
                <Typography 
                  variant="caption" 
                  color="error" 
                  sx={{ mt: 1, display: 'block' }}
                >
                  {error.message}
                </Typography>
              )}
            </Box>
          );
        }
        
        // Single checkbox (fallback for backward compatibility)
        return (
          <FormControlLabel
            key={field.id}
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                sx={{ '&.Mui-checked': { color: 'primary.main' } }}
              />
            }
            label={
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {field.label}
              </Typography>
            }
            sx={{ 
              mb: 2,
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          />
        );

      case FIELD_TYPES.DATE:
        return (
          <DatePicker
            key={field.id}
            label={field.label}
            value={value && typeof value !== 'boolean' && !Array.isArray(value) ? new Date(value) : null}
            onChange={(date) => handleFieldChange(field.id, date)}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                required: field.required,
                error: isTouched && !!error,
                helperText: isTouched && error ? error.message : '',
                size: "medium",
                ...commonFieldProps
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
            value={typeof value === 'string' || typeof value === 'number' ? value : ''}
            InputProps={{ readOnly: true }}
            margin="normal"
            size="medium"
            helperText={`Calculated from: ${field.formula}`}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'grey.50'
              }
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 4,
            color: 'text.primary'
          }}
        >
          Form
        </Typography>
        
        {errors.length > 0 && showValidation && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Please fix the following errors:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {errors.map((error) => (
                <li key={error.fieldId}>
                  <Typography variant="body2">
                    {error.message}
                  </Typography>
                </li>
              ))}
            </ul>
          </Alert>
        )}

        {showValidationSummary && (
          <Paper 
            elevation={2} 
            sx={{ 
              mb: 3, 
              p: 3, 
              borderRadius: 2,
              border: '1px solid',
              borderColor: errors.length > 0 ? 'error.main' : 'success.main',
              bgcolor: errors.length > 0 ? 'error.light' : 'success.light'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: errors.length > 0 ? 'error.dark' : 'success.dark' }}>
              {errors.length > 0 ? '❌ Validation Failed' : '✅ All Requirements Met!'}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Validation Summary:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {validationResults.filter(r => r.isValid).length} of {validationResults.length} fields are valid
              </Typography>
            </Box>

            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {validationResults.map((result) => (
                <Box 
                  key={result.fieldId} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'background.paper'
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      color: result.isValid ? 'success.main' : 'error.main',
                      flex: 1
                    }}
                  >
                    {result.isValid ? '✅' : '❌'} {result.label}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color={result.isValid ? 'success.main' : 'error.main'}
                  >
                    {result.message}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowValidationSummary(false)}
              sx={{ mt: 2 }}
            >
              Hide Summary
            </Button>
          </Paper>
        )}

        <Box sx={{ mb: 4 }}>
          {fields.map((field, index) => (
            <Box key={field.id} sx={{ mb: 3 }}>
              {renderField(field)}
            </Box>
          ))}
        </Box>

        <Box sx={{ 
          mt: 4, 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ 
              borderRadius: 2, 
              px: 4, 
              py: 1.5,
              fontWeight: 600,
              minWidth: 120
            }}
          >
            Submit & Test
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() => setFormData({})}
            size="large"
            sx={{ 
              borderRadius: 2, 
              px: 4, 
              py: 1.5,
              fontWeight: 600
            }}
          >
            Reset
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormRenderer;
