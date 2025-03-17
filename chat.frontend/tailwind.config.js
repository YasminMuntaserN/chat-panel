/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#07b8db',
        onPrimary: '#bfdbfe',
        accent: '#178ea6',
        background: '#ffffff',
      },
    },
  },
  plugins: [],
};

/*
      colors: {
        primary: '#07b8db',
        onPrimary: '#bfdbfe',
        accent: '#07b8dd',
        background: '#ffffff',
      },
            colors: {
        primary: '#2563eb',    
        onPrimary: '#bfdbfe',  
        accent: '#1d4ed1',     
        background: '#ffffff',
      },
* */