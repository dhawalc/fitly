/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a365d',
        secondary: '#e2e8f0',
        muted: '#f1f5f9',
        'primary-foreground': '#ffffff',
        'secondary-foreground': '#1a365d',
        'muted-foreground': '#64748b',
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#1a365d',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
