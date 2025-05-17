export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'email' | 'tel';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
  dependsOn?: {
    field: string;
    value: any;
    operator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  };
  group?: string;
  order: number;
}

export interface FormGroup {
  id: string;
  title: string;
  description?: string;
  fields: string[]; // Array of field IDs
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  groups: FormGroup[];
  fields: FormField[];
  submitButtonText?: string;
  successMessage?: string;
  errorMessage?: string;
}

// Example form configuration
export const quoteFormConfig: FormConfig = {
  id: 'quote-request',
  title: 'Product Quote Request',
  description: 'Please fill out the form below to request a quote for our products.',
  groups: [
    {
      id: 'product-details',
      title: 'Product Information',
      description: 'Tell us about the product you\'re interested in.',
      fields: ['productType', 'quantity', 'customRequirements']
    },
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'How can we reach you?',
      fields: ['name', 'email', 'phone', 'company']
    },
    {
      id: 'additional-details',
      title: 'Additional Information',
      description: 'Any other details you\'d like to share?',
      fields: ['preferredContact', 'urgency', 'notes']
    }
  ],
  fields: [
    {
      id: 'productType',
      label: 'Product Type',
      type: 'select',
      required: true,
      placeholder: 'Select a product type',
      helpText: 'Choose the type of product you\'re interested in',
      options: [
        { label: 'Type A - Standard', value: 'Type A' },
        { label: 'Type B - Premium', value: 'Type B' },
        { label: 'Type C - Custom', value: 'Type C' }
      ],
      order: 1,
      group: 'product-details'
    },
    {
      id: 'quantity',
      label: 'Quantity',
      type: 'number',
      required: true,
      placeholder: 'Enter quantity',
      validation: {
        min: 1,
        max: 1000
      },
      dependsOn: {
        field: 'productType',
        value: null,
        operator: 'notEquals'
      },
      order: 2,
      group: 'product-details'
    },
    {
      id: 'customRequirements',
      label: 'Custom Requirements',
      type: 'textarea',
      required: false,
      placeholder: 'Describe your custom requirements',
      helpText: 'Please provide any specific requirements or modifications needed',
      dependsOn: {
        field: 'productType',
        value: 'Type C',
        operator: 'equals'
      },
      order: 3,
      group: 'product-details'
    },
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your full name',
      order: 4,
      group: 'contact-info'
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email address',
      validation: {
        pattern: '^[^@]+@[^@]+\\.[^@]+$'
      },
      order: 5,
      group: 'contact-info'
    },
    {
      id: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: false,
      placeholder: 'Enter your phone number',
      validation: {
        pattern: '^\\+?[1-9]\\d{1,14}$'
      },
      order: 6,
      group: 'contact-info'
    },
    {
      id: 'company',
      label: 'Company Name',
      type: 'text',
      required: false,
      placeholder: 'Enter your company name',
      order: 7,
      group: 'contact-info'
    },
    {
      id: 'preferredContact',
      label: 'Preferred Contact Method',
      type: 'radio',
      required: true,
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone' }
      ],
      order: 8,
      group: 'additional-details'
    },
    {
      id: 'urgency',
      label: 'Urgency Level',
      type: 'select',
      required: false,
      options: [
        { label: 'Not Urgent', value: 'low' },
        { label: 'Moderate', value: 'medium' },
        { label: 'Urgent', value: 'high' }
      ],
      order: 9,
      group: 'additional-details'
    },
    {
      id: 'notes',
      label: 'Additional Notes',
      type: 'textarea',
      required: false,
      placeholder: 'Any additional information you\'d like to share',
      order: 10,
      group: 'additional-details'
    }
  ],
  submitButtonText: 'Request Quote',
  successMessage: 'Thank you for your quote request! We will contact you shortly.',
  errorMessage: 'There was an error submitting your request. Please try again.'
}; 