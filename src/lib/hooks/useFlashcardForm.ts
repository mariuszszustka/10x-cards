import { useState, useCallback, useRef, useEffect } from 'react';

export interface FlashcardFormData {
  front: string;
  back: string;
  source: string;
}

interface ValidationErrors {
  front: string;
  back: string;
  [key: string]: string;
}

interface UseFlashcardFormOptions {
  initialValues?: FlashcardFormData;
  onSubmit: (data: FlashcardFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function useFlashcardForm({
  initialValues = { front: '', back: '', source: 'manual' },
  onSubmit,
  onCancel
}: UseFlashcardFormOptions) {
  // Stan formularza
  const [formData, setFormData] = useState<FlashcardFormData>({
    front: initialValues.front,
    back: initialValues.back,
    source: initialValues.source
  });
  
  // Stan błędów
  const [errors, setErrors] = useState<ValidationErrors>({
    front: '',
    back: ''
  });

  // Referencja do pierwszego pola dla dostępności
  const frontInputRef = useRef<HTMLTextAreaElement>(null);

  // Ustawienie fokusu na pierwsze pole po załadowaniu
  useEffect(() => {
    if (frontInputRef.current) {
      frontInputRef.current.focus();
    }
  }, []);

  // Obsługa zmiany pól formularza
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Walidacja
    if (name === 'front' || name === 'back') {
      if (!value.trim()) {
        setErrors(prev => ({
          ...prev,
          [name]: 'To pole jest wymagane'
        }));
      } else if (value.length > 500) {
        setErrors(prev => ({
          ...prev,
          [name]: 'Tekst nie może przekraczać 500 znaków'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  }, []);

  // Resetowanie formularza
  const resetForm = useCallback(() => {
    setFormData({
      front: '',
      back: '',
      source: 'manual'
    });
    setErrors({
      front: '',
      back: ''
    });
    
    // Przywrócenie fokusu na pierwszy input
    if (frontInputRef.current) {
      frontInputRef.current.focus();
    }
  }, []);

  // Walidacja formularza
  const validateForm = useCallback(() => {
    const newErrors = {
      front: '',
      back: ''
    };
    
    if (!formData.front.trim()) {
      newErrors.front = 'To pole jest wymagane';
    }
    
    if (!formData.back.trim()) {
      newErrors.back = 'To pole jest wymagane';
    }
    
    setErrors(newErrors);
    return !newErrors.front && !newErrors.back;
  }, [formData]);

  // Obsługa zapisu fiszki
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
    resetForm();
  }, [formData, onSubmit, validateForm, resetForm]);

  // Obsługa anulowania
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    resetForm();
  }, [onCancel, resetForm]);

  return {
    formData,
    errors,
    frontInputRef,
    handleChange,
    handleSubmit,
    handleCancel
  };
} 