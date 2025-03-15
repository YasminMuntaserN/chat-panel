/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',    
        onPrimary: '#bfdbfe',  
        accent: '#1d4ed1',     
        background: '#ffffff',
      },
    },
  },
  plugins: [],
};
