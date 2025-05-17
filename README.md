# Preact Jotform Integration

A modern, type-safe form implementation built with Preact and integrated with Jotform. This project demonstrates how to create a multi-step form with dynamic field validation and Jotform integration.

## Features

- Multi-step form with grouped fields
- Dynamic field validation
- Field dependencies and conditional visibility
- Jotform integration
- Responsive design
- TypeScript support
- Vercel deployment ready

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- A Jotform account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/preact-jotform-demo.git
cd preact-jotform-demo
```

2. Install dependencies:
```bash
npm install
```

3. Create a Jotform form and get your form ID

4. Update the form configuration in `src/config/formConfig.ts`

5. Update the Jotform form ID in `src/components/QuoteForm.tsx`

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Deployment

This project is configured for deployment on Vercel. To deploy:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the project and deploy it

## Project Structure

```
├── src/
│   ├── components/
│   │   └── QuoteForm.tsx    # Main form component
│   ├── config/
│   │   └── formConfig.ts    # Form configuration
│   ├── App.tsx             # Application entry point
│   ├── index.tsx           # Application bootstrap
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html             # HTML template
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── vercel.json            # Vercel deployment configuration
```

## Configuration

### Form Configuration

The form is configured in `src/config/formConfig.ts`. You can modify:

- Form fields and their properties
- Field groups
- Validation rules
- Field dependencies
- Messages and labels

### Jotform Integration

1. Create a form in Jotform
2. Enable "Embed Form" in form settings
3. Add your domain to allowed domains
4. Enable "Post Message" for form submission events
5. Update the form ID in `QuoteForm.tsx`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 