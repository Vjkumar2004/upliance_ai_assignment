export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password';
  value: string;
}

export interface FieldOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'email' | 'password' | 'derived';
  label: string;
  defaultValue: string;
  required: boolean;
  validations: ValidationRule[];
  options?: FieldOption[];
  parentFields?: string[];
  formula?: string;
  readonly?: boolean;
}

export interface FormSchema {
  id?: string;
  name: string;
  fields: FormField[];
  createdAt?: Date;
}

export interface FormData {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: Date;
}

// New interface for form field values
export interface FormValues {
  [key: string]: string | number | boolean | Date | string[];
}

export interface ValidationError {
  fieldId: string;
  message: string;
}
