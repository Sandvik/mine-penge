/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary teal colors inspired by the CSS
        primary: {
          50: '#e8eff1',
          100: '#d1dfe3',
          200: '#a3bfc7',
          300: '#759fab',
          400: '#477f8f',
          500: '#00a7b7', // Main primary color
          600: '#0096a4',
          700: '#008591',
          800: '#00747e',
          900: '#00636b',
        },
        // Light teal for accents
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#00cbe0', // Primary light
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Neutral grays
        nordic: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Success colors
        success: {
          50: '#f7f9e8',
          100: '#eff3d1',
          200: '#dfe7a3',
          300: '#cfdb75',
          400: '#bfcf47',
          500: '#a5b200', // Success green
          600: '#949f00',
          700: '#838c00',
          800: '#727900',
          900: '#616600',
        },
        // Error colors
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#c50c0c', // Error red
          600: '#b10b0b',
          700: '#9d0a0a',
          800: '#890909',
          900: '#750808',
        },
        // Warning colors
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#ed8900', // Warning orange
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
} 