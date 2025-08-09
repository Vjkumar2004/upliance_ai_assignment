import { FIELD_TYPES } from '../components/FormBuilder/FieldTypes';
import { FormField, FormData } from '../types/form';

export const mockSavedForms: FormData[] = [];

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
