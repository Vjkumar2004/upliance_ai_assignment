import { FIELD_TYPES } from '../components/FormBuilder/FieldTypes';
import { FormField, FormData } from '../types/form';

export const mockSavedForms: FormData[] = [
  {
    id: '1',
    name: 'Contact Form',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        defaultValue: '',
        required: true,
        validations: [
          {
            type: 'minLength',
            value: '2'
          }
        ]
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        defaultValue: '',
        required: true,
        validations: [
          {
            type: 'email',
            value: ''
          }
        ]
      },
      {
        id: 'message',
        type: 'textarea',
        label: 'Message',
        defaultValue: '',
        required: true,
        validations: []
      }
    ],
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'User Registration',
    fields: [
      {
        id: 'username',
        type: 'text',
        label: 'Username',
        defaultValue: '',
        required: true,
        validations: [
          {
            type: 'minLength',
            value: '3'
          },
          {
            type: 'maxLength',
            value: '20'
          }
        ]
      },
      {
        id: 'password',
        type: 'password',
        label: 'Password',
        defaultValue: '',
        required: true,
        validations: [
          {
            type: 'password',
            value: ''
          }
        ]
      },
      {
        id: 'age',
        type: 'number',
        label: 'Age',
        defaultValue: '',
        required: true,
        validations: []
      },
      {
        id: 'birthYear',
        type: 'derived',
        label: 'Birth Year',
        defaultValue: '',
        required: false,
        validations: [],
        parentFields: ['age'],
        formula: '2024 - age',
        readonly: true
      }
    ],
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Feedback Survey',
    fields: [
      {
        id: 'rating',
        type: 'select',
        label: 'How would you rate our service?',
        defaultValue: '',
        required: true,
        validations: [],
        options: [
          { value: '5', label: 'Excellent' },
          { value: '4', label: 'Very Good' },
          { value: '3', label: 'Good' },
          { value: '2', label: 'Fair' },
          { value: '1', label: 'Poor' }
        ]
      },
      {
        id: 'recommend',
        type: 'radio',
        label: 'Would you recommend us to others?',
        defaultValue: '',
        required: true,
        validations: [],
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'maybe', label: 'Maybe' }
        ]
      },
      {
        id: 'newsletter',
        type: 'checkbox',
        label: 'Subscribe to newsletter',
        defaultValue: '',
        required: false,
        validations: []
      }
    ],
    createdAt: new Date()
  }
];

export const getCurrentFormFromStorage = (): FormData | null => {
  try {
    const stored = localStorage.getItem('currentForm');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const saveCurrentFormToStorage = (formData: FormData): void => {
  try {
    localStorage.setItem('currentForm', JSON.stringify(formData));
  } catch (error) {
    console.error('Error saving form to localStorage:', error);
  }
};

export const getSavedFormsFromStorage = (): FormData[] => {
  try {
    const stored = localStorage.getItem('savedForms');
    return stored ? JSON.parse(stored) : mockSavedForms;
  } catch {
    return mockSavedForms;
  }
};

export const saveFormToStorage = (formData: FormData): FormData | null => {
  try {
    const savedForms = getSavedFormsFromStorage();
    const newForm = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const updatedForms = [newForm, ...savedForms];
    localStorage.setItem('savedForms', JSON.stringify(updatedForms));
    return newForm;
  } catch (error) {
    console.error('Error saving form to localStorage:', error);
    return null;
  }
};
