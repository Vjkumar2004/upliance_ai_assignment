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
    <Card sx={{ mb: 2, borderLeft: 4, borderLeftColor: 'primary.main' }}>
      <CardHeader
        avatar={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragIcon sx={{ color: 'text.secondary', cursor: 'grab' }} />
            <Typography variant="subtitle2" color="text.secondary">
              {getFieldTypeLabel(field.type)}
            </Typography>
            <Chip label={field.type} size="small" variant="outlined" />
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => onMove(field.id, 'up')}
              disabled={index === 0}
            >
              <UpIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onMove(field.id, 'down')}
              disabled={index === totalFields - 1}
            >
              <DownIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(field.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent>
        <Grid container spacing={3}>
          {/* Basic Properties */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Label"
              value={field.label}
              onChange={(e) => updateField({ label: e.target.value })}
              placeholder="Enter field label"
              size="small"
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
              size="small"
            />
          </Grid>

          {/* Required Toggle */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={field.required}
                  onChange={(e) => updateField({ required: e.target.checked })}
                />
              }
              label="Required field"
            />
          </Grid>

          {/* Field-specific options */}
          {(field.type === FIELD_TYPES.SELECT || field.type === FIELD_TYPES.RADIO) && (
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="subtitle2">Options</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ space: 2 }}>
                    {field.options?.map((option, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                          label="Value"
                          value={option.value}
                          onChange={(e) => updateOption(index, 'value', e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="Label"
                          value={option.label}
                          onChange={(e) => updateOption(index, 'label', e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeOption(index)}
                          color="error"
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addOption}
                      variant="outlined"
                      size="small"
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
              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="subtitle2">Derived Field Configuration</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
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
                        size="small"
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}

          {/* Validations */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandIcon />}>
                <Typography variant="subtitle2">Validations</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ space: 2 }}>
                  {field.validations.map((validation, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                      <Chip label={validation.type} size="small" />
                      {validation.type !== 'required' && (
                        <TextField
                          label="Value"
                          value={validation.value}
                          onChange={(e) => updateValidation(index, e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                        />
                      )}
                      <IconButton
                        size="small"
                        onClick={() => removeValidation(index)}
                        color="error"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Object.values(VALIDATION_TYPES).map((type) => (
                      <Button
                        key={type}
                        size="small"
                        variant="outlined"
                        onClick={() => addValidation(type)}
                        disabled={field.validations.some(v => v.type === type)}
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
