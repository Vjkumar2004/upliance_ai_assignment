import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  Delete as DeleteIcon,
  KeyboardArrowUp as UpIcon,
  KeyboardArrowDown as DownIcon,
  ExpandMore as ExpandIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { FIELD_TYPES, VALIDATION_TYPES } from '../../constants/fieldTypes';
import { FormField, ValidationRule, FieldOption } from '../../types/form';

interface FieldEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  onMove: (fieldId: string, direction: 'up' | 'down') => void;
  allFields: FormField[];
  index: number;
  totalFields: number;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  onUpdate,
  onDelete,
  onMove,
  allFields,
  index,
  totalFields
}) => {
  const [showValidations, setShowValidations] = useState(false);

  const updateField = (updates: Partial<FormField>) => {
    onUpdate({ ...field, ...updates });
  };

  const addOption = () => {
    const newOptions = [...(field.options || []), { value: '', label: '' }];
    updateField({ options: newOptions });
  };

  const updateOption = (index: number, key: keyof FieldOption, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = { ...newOptions[index], [key]: value };
    updateField({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = field.options?.filter((_, i) => i !== index) || [];
    updateField({ options: newOptions });
  };

  const addValidation = (type: string) => {
    const newValidations = [...field.validations, { type: type as any, value: '' }];
    updateField({ validations: newValidations });
  };

  const updateValidation = (index: number, value: string) => {
    const newValidations = [...field.validations];
    newValidations[index] = { ...newValidations[index], value };
    updateField({ validations: newValidations });
  };

  const removeValidation = (index: number) => {
    const newValidations = field.validations.filter((_, i) => i !== index);
    updateField({ validations: newValidations });
  };

  const availableParentFields = allFields.filter(f => 
    f.id !== field.id && f.type !== FIELD_TYPES.DERIVED
  );

  const getFieldTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card sx={{ 
      mb: 3, 
      borderLeft: 4, 
      borderLeftColor: 'primary.main',
      borderRadius: 3,
      boxShadow: 2,
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: 4,
        transform: 'translateY(-2px)'
      }
    }}>
      <CardHeader
        avatar={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DragIcon sx={{ color: 'primary.main', cursor: 'grab', fontSize: 20 }} />
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
              {getFieldTypeLabel(field.type)}
            </Typography>
            <Chip 
              label={field.type} 
              size="small" 
              variant="outlined"
              sx={{ borderRadius: 2, fontWeight: 500 }}
            />
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => onMove(field.id, 'up')}
              disabled={index === 0}
              sx={{ 
                borderRadius: 2,
                '&:hover': { bgcolor: 'primary.light', color: 'white' }
              }}
            >
              <UpIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onMove(field.id, 'down')}
              disabled={index === totalFields - 1}
              sx={{ 
                borderRadius: 2,
                '&:hover': { bgcolor: 'primary.light', color: 'white' }
              }}
            >
              <DownIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(field.id)}
              color="error"
              sx={{ 
                borderRadius: 2,
                '&:hover': { bgcolor: 'error.light', color: 'white' }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        }
        sx={{ 
          pb: 1,
          '& .MuiCardHeader-content': {
            minWidth: 0
          }
        }}
      />
      
      <CardContent sx={{ pt: 0, px: 4, pb: 4 }}>
        <Grid container spacing={3}>
          {/* Basic Properties */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Label"
              value={field.label}
              onChange={(e) => updateField({ label: e.target.value })}
              placeholder="Enter field label"
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Default Value"
              value={field.defaultValue}
              onChange={(e) => updateField({ defaultValue: e.target.value })}
              placeholder="Enter default value"
              disabled={field.type === FIELD_TYPES.DERIVED}
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Grid>

          {/* Required Toggle */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={field.required}
                  onChange={(e) => updateField({ required: e.target.checked })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main'
                    }
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Required field
                </Typography>
              }
            />
          </Grid>

          {/* Field-specific options */}
          {(field.type === FIELD_TYPES.SELECT || field.type === FIELD_TYPES.RADIO || field.type === FIELD_TYPES.CHECKBOX) && (
            <Grid item xs={12}>
              <Accordion 
                sx={{ 
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: 1
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandIcon />}
                  sx={{ 
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Options
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                  <Box sx={{ space: 2 }}>
                    {field.options?.map((option, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                        <TextField
                          label="Value"
                          value={option.value}
                          onChange={(e) => updateOption(index, 'value', e.target.value)}
                          size="small"
                          sx={{ 
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                        <TextField
                          label="Label"
                          value={option.label}
                          onChange={(e) => updateOption(index, 'label', e.target.value)}
                          size="small"
                          sx={{ 
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeOption(index)}
                          color="error"
                          sx={{ borderRadius: 2 }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addOption}
                      variant="outlined"
                      size="medium"
                      sx={{ borderRadius: 2, mt: 1 }}
                    >
                      Add Option
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}

          {/* Derived field configuration */}
          {field.type === FIELD_TYPES.DERIVED && (
            <Grid item xs={12}>
              <Accordion 
                sx={{ 
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: 1
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandIcon />}
                  sx={{ 
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Derived Field Configuration
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="medium">
                        <InputLabel>Parent Fields</InputLabel>
                        <Select
                          multiple
                          value={field.parentFields || []}
                          onChange={(e) => updateField({ 
                            parentFields: typeof e.target.value === 'string' 
                              ? e.target.value.split(',') 
                              : e.target.value 
                          })}
                          label="Parent Fields"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        >
                          {availableParentFields.map((f) => (
                            <MenuItem key={f.id} value={f.id}>
                              {f.label || f.id}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Formula"
                        value={field.formula || ''}
                        onChange={(e) => updateField({ formula: e.target.value })}
                        placeholder="e.g., field1 + field2 * 2"
                        size="medium"
                        multiline
                        rows={2}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}

          {/* Validations */}
          <Grid item xs={12}>
            <Accordion 
              sx={{ 
                borderRadius: 2,
                '&:before': { display: 'none' },
                boxShadow: 1
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandIcon />}
                sx={{ 
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'grey.50' }
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Validations
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 2 }}>
                <Box sx={{ space: 2 }}>
                  {field.validations.map((validation, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                      <Chip 
                        label={validation.type} 
                        size="small"
                        sx={{ borderRadius: 2, fontWeight: 500 }}
                      />
                      {validation.type !== 'required' && (
                        <TextField
                          label="Value"
                          value={validation.value}
                          onChange={(e) => updateValidation(index, e.target.value)}
                          size="small"
                          sx={{ 
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      )}
                      <IconButton
                        size="small"
                        onClick={() => removeValidation(index)}
                        color="error"
                        sx={{ borderRadius: 2 }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                    {Object.values(VALIDATION_TYPES).map((type) => (
                      <Button
                        key={type}
                        size="small"
                        variant="outlined"
                        onClick={() => addValidation(type)}
                        disabled={field.validations.some(v => v.type === type)}
                        sx={{ borderRadius: 2 }}
                      >
                        Add {type}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FieldEditor;
