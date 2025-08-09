import { FormSchema } from '../types/form';
import { mockSavedForms } from '../mock/formData';

export const getCurrentFormFromStorage = (): FormSchema | null => {
  try {
    const stored = localStorage.getItem('currentForm');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const saveCurrentFormToStorage = (formData: Partial<FormSchema>): void => {
  try {
    localStorage.setItem('currentForm', JSON.stringify(formData));
  } catch (error) {
    console.error('Error saving form to localStorage:', error);
  }
};

export const getSavedFormsFromStorage = (): FormSchema[] => {
  try {
    const stored = localStorage.getItem('savedForms');
    return stored ? JSON.parse(stored) : mockSavedForms;
  } catch {
    return mockSavedForms;
  }
};

export const saveFormToStorage = (formData: FormSchema): FormSchema | null => {
  try {
    const savedForms = getSavedFormsFromStorage();
    const newForm: FormSchema = {
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
