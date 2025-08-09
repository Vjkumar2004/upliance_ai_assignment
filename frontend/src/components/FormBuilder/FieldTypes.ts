import { ValidationRule } from '../../types/form';

export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number', 
  TEXTAREA: 'textarea',
  SELECT: 'select',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  DATE: 'date',
  EMAIL: 'email',
  PASSWORD: 'password',
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

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDefaults {
  id: string;
  type: FieldType;
  label: string;
  defaultValue: string;
  required: boolean;
  validations: ValidationRule[];
  options?: FieldOption[];
  parentFields?: string[];
  formula?: string;
  readonly?: boolean;
}

export const getFieldDefaults = (type: FieldType): FieldDefaults => {
  const baseDefaults: FieldDefaults = {
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
      return {
        ...baseDefaults,
        options: [{ value: '', label: '' }]
      };
    case FIELD_TYPES.DERIVED:
      return {
        ...baseDefaults,
        parentFields: [],
        formula: '',
        readonly: true
      };
    default:
      return baseDefaults;
  }
};
