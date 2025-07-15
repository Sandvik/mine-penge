// === DESIGN TOKENS ===
// Ændr kun værdierne her for at ændre hele sitets udseende!
const colors = {
  // === Baggrunde ===
  'bg-main': '#f5f5f5',      // Hovedbaggrund
  'bg-container': '#e0e7ef', // Container/sektion baggrund
  'bg-card': '#ffffff',      // Kort/box baggrund
  'bg-accent': '#f0f4f8',    // Accent baggrund

  // === Tekst ===
  'text-main': '#22223b',    // Primær tekst
  'text-muted': '#6c757d',   // Dæmpet tekst
  'text-inverse': '#fff',    // Tekst på mørk baggrund

  // === Primær/sekundær ===
  'primary': '#1e90ff',      // Primær farve (fx knapper, links)
  'primary-hover': '#1565c0',
  'secondary': '#ffb703',    // Sekundær farve
  'secondary-hover': '#ff9800',

  // === Status ===
  'success': '#4caf50',
  'warning': '#ff9800',
  'danger': '#f44336',
};

const fontFamily = {
  'sans': ['Inter', 'Arial', 'sans-serif'],
  'heading': ['Montserrat', 'sans-serif'],
  // Tilføj flere hvis nødvendigt
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        // Primary teal colors inspired by the CSS - mørkere versioner
        primary: {
          50: '#d1dfe3',   // Mørkere end før
          100: '#a3bfc7',  // Mørkere end før
          200: '#759fab',  // Mørkere end før
          300: '#477f8f',  // Mørkere end før
          400: '#195f73',  // Mørkere end før
          500: '#00a7b7', // Main primary color
          600: '#0096a4',
          700: '#008591',
          800: '#00747e',
          900: '#00636b',
        },
        // Light teal for accents - mørkere versioner
        teal: {
          50: '#ccfbf1',   // Mørkere end før
          100: '#99f6e4',  // Mørkere end før
          200: '#5eead4',  // Mørkere end før
          300: '#2dd4bf',  // Mørkere end før
          400: '#14b8a6',  // Mørkere end før
          500: '#00cbe0', // Primary light
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Neutral grays - mørkere versioner
        nordic: {
          50: '#f1f5f9',   // Mørkere end før
          100: '#e2e8f0',  // Mørkere end før
          200: '#cbd5e1',  // Mørkere end før
          300: '#94a3b8',  // Mørkere end før
          400: '#64748b',  // Mørkere end før
          500: '#475569',  // Mørkere end før
          600: '#334155',  // Mørkere end før
          700: '#1e293b',  // Mørkere end før
          800: '#0f172a',  // Mørkere end før
          900: '#020617',  // Mørkere end før
        },
        // Success colors - mørkere versioner
        success: {
          50: '#eff3d1',   // Mørkere end før
          100: '#dfe7a3',  // Mørkere end før
          200: '#cfdb75',  // Mørkere end før
          300: '#bfcf47',  // Mørkere end før
          400: '#afc319',  // Mørkere end før
          500: '#a5b200', // Success green
          600: '#949f00',
          700: '#838c00',
          800: '#727900',
          900: '#616600',
        },
        // Error colors - mørkere versioner
        error: {
          50: '#fee2e2',   // Mørkere end før
          100: '#fecaca',  // Mørkere end før
          200: '#fca5a5',  // Mørkere end før
          300: '#f87171',  // Mørkere end før
          400: '#ef4444',  // Mørkere end før
          500: '#c50c0c', // Error red
          600: '#b10b0b',
          700: '#9d0a0a',
          800: '#890909',
          900: '#750808',
        },
        // Warning colors - mørkere versioner
        warning: {
          50: '#fef3c7',   // Mørkere end før
          100: '#fde68a',  // Mørkere end før
          200: '#fcd34d',  // Mørkere end før
          300: '#fbbf24',  // Mørkere end før
          400: '#f59e0b',  // Mørkere end før
          500: '#ed8900', // Warning orange
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        ...fontFamily,
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        display: ['Inter', 'sans-serif'],
        modern: ['Albert Sans', 'sans-serif'],
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
};
// === SLUT PÅ DESIGN TOKENS ===
// Brug fx className="bg-bg-main text-text-main" i dine komponenter 