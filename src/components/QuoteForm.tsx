import { useState, useCallback } from 'preact/hooks';
import { signal } from '@preact/signals';
import type { JSX } from 'preact';
import { quoteFormConfig, type FormField } from '../config/formConfig';

// Form state
const formData = signal<Record<string, any>>({});
const formErrors = signal<Record<string, string>>({});

export function QuoteForm(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showIframe, setShowIframe] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(0);

  const validateField = useCallback((field: FormField, value: any): string | null => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      if (field.type === 'number') {
        const numValue = Number(value);
        if (field.validation.min !== undefined && numValue < field.validation.min) {
          return `${field.label} must be at least ${field.validation.min}`;
        }
        if (field.validation.max !== undefined && numValue > field.validation.max) {
          return `${field.label} must be at most ${field.validation.max}`;
        }
      }

      if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
        return `${field.label} is invalid`;
      }

      if (field.validation.custom) {
        return field.validation.custom(value);
      }
    }

    return null;
  }, []);

  const isFieldVisible = useCallback((field: FormField): boolean => {
    if (!field.dependsOn) return true;
    const dependentValue = formData.value[field.dependsOn.field];
    
    switch (field.dependsOn.operator) {
      case 'equals':
        return dependentValue === field.dependsOn.value;
      case 'notEquals':
        return dependentValue !== field.dependsOn.value;
      case 'contains':
        return String(dependentValue).includes(String(field.dependsOn.value));
      case 'greaterThan':
        return Number(dependentValue) > Number(field.dependsOn.value);
      case 'lessThan':
        return Number(dependentValue) < Number(field.dependsOn.value);
      default:
        return dependentValue === field.dependsOn.value;
    }
  }, [formData.value]);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    console.log('Form submission started', formData.value);

    // Validate all visible fields
    const errors: Record<string, string> = {};
    quoteFormConfig.fields.forEach(field => {
      if (isFieldVisible(field)) {
        const error = validateField(field, formData.value[field.id]);
        if (error) errors[field.id] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      formErrors.value = errors;
      setIsSubmitting(false);
      return;
    }

    // Show the Jotform iframe
    console.log('Showing Jotform iframe');
    setShowIframe(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (fieldId: string, value: any) => {
    formData.value = { ...formData.value, [fieldId]: value };
    const field = quoteFormConfig.fields.find(f => f.id === fieldId);
    if (field) {
      const error = validateField(field, value);
      formErrors.value = {
        ...formErrors.value,
        [fieldId]: error || ''
      };
    }
  };

  const handleNextGroup = () => {
    if (currentGroup < quoteFormConfig.groups.length - 1) {
      setCurrentGroup(prev => prev + 1);
    }
  };

  const handlePrevGroup = () => {
    if (currentGroup > 0) {
      setCurrentGroup(prev => prev - 1);
    }
  };

  // Handle iframe load event
  const handleIframeLoad = () => {
    // You can add any initialization logic here if needed
  };

  // Handle iframe message from Jotform
  const handleIframeMessage = (event: MessageEvent) => {
    console.log('Received message from iframe:', event.data);
    if (event.data.event === 'formSubmitted') {
      console.log('Form submitted successfully');
      setSubmitStatus('success');
      setShowIframe(false);
      formData.value = {};
    }
  };

  // Add event listener for iframe messages
  if (typeof window !== 'undefined') {
    window.addEventListener('message', handleIframeMessage);
  }

  const currentGroupConfig = quoteFormConfig.groups[currentGroup];
  const currentFields = quoteFormConfig.fields
    .filter(field => field.group === currentGroupConfig.id)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="quote-form-container">
      {!showIframe ? (
        <form onSubmit={handleSubmit} className="quote-form">
          <div className="form-group">
            <h2>{currentGroupConfig.title}</h2>
            {currentGroupConfig.description && (
              <p className="group-description">{currentGroupConfig.description}</p>
            )}
            
            {currentFields.map(field => (
              isFieldVisible(field) && (
                <div key={field.id} className="form-field">
                  <label htmlFor={field.id}>{field.label}</label>
                  {field.helpText && (
                    <p className="field-help">{field.helpText}</p>
                  )}
                  
                  {field.type === 'select' ? (
                    <select
                      id={field.id}
                      value={formData.value[field.id] || ''}
                      onChange={(e: Event) => handleInputChange(field.id, (e.target as HTMLSelectElement).value)}
                      required={field.required}
                    >
                      <option value="">{field.placeholder || `Select ${field.label}`}</option>
                      {field.options?.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : field.type === 'radio' ? (
                    <div className="radio-group">
                      {field.options?.map(option => (
                        <label key={option.value} className="radio-label">
                          <input
                            type="radio"
                            name={field.id}
                            value={option.value}
                            checked={formData.value[field.id] === option.value}
                            onChange={(e: Event) => handleInputChange(field.id, (e.target as HTMLInputElement).value)}
                            required={field.required}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={field.id}
                      value={formData.value[field.id] || ''}
                      onChange={(e: Event) => handleInputChange(field.id, (e.target as HTMLTextAreaElement).value)}
                      required={field.required}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type={field.type}
                      id={field.id}
                      value={formData.value[field.id] || ''}
                      onChange={(e: Event) => handleInputChange(field.id, (e.target as HTMLInputElement).value)}
                      required={field.required}
                      placeholder={field.placeholder}
                    />
                  )}
                  {formErrors.value[field.id] && (
                    <span className="error">{formErrors.value[field.id]}</span>
                  )}
                </div>
              )
            ))}

            <div className="form-navigation">
              {currentGroup > 0 && (
                <button type="button" onClick={handlePrevGroup} className="nav-button">
                  Previous
                </button>
              )}
              {currentGroup < quoteFormConfig.groups.length - 1 ? (
                <button type="button" onClick={handleNextGroup} className="nav-button">
                  Next
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="submit-button">
                  {isSubmitting ? 'Submitting...' : quoteFormConfig.submitButtonText}
                </button>
              )}
            </div>
          </div>

          {submitStatus === 'success' && (
            <div className="success-message">
              {quoteFormConfig.successMessage}
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="error-message">
              {quoteFormConfig.errorMessage}
            </div>
          )}
        </form>
      ) : (
        <div className="jotform-container">
          <iframe
            src="https://form.jotform.com/240000000000000" // Replace with your actual form ID
            title="Quote Request Form"
            width="100%"
            height="800px"
            frameBorder="0"
            onLoad={handleIframeLoad}
          />
        </div>
      )}
    </div>
  );
} 