import { FormField } from '../types/form';

export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number', 
  TEXTAREA: 'textarea',
  SELECT: 'select',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  DATE: 'date',
  DERIVED: 'derived'
} as const;

export const VALIDATION_TYPES = {
  REQUIRED: 'required',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength', 
  EMAIL: 'email',
  PASSWORD: 'password'
} as const;

export type FieldType = typeof FIELD_TYPES[keyof typeof FIELD_TYPES];
export type ValidationType = typeof VALIDATION_TYPES[keyof typeof VALIDATION_TYPES];

export const getFieldDefaults = (type: FieldType): FormField => {
  const baseDefaults: Partial<FormField> = {
    id: Date.now().toString(),
    type,
    label: '',
    defaultValue: '',
    required: false,
    validations: []
  };

  switch (type) {
    case FIELD_TYPES.SELECT:
    case FIELD_TYPES.RADIO:
    case FIELD_TYPES.CHECKBOX:
      return {
        ...baseDefaults,
        options: [{ value: '', label: '' }]
      } as FormField;
    case FIELD_TYPES.DERIVED:
      return {
        ...baseDefaults,
        parentFields: [],
        formula: '',
        readonly: true
      } as FormField;
    default:
      return baseDefaults as FormField;
  }
};
