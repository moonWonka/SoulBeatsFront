export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          // Modo claro: fuchsia/rosa
          light: {
            50: '#fdf4ff',
            100: '#fae8ff',
            200: '#f5d0fe',
            300: '#f0abfc',
            400: '#e879f9',
            500: '#d946ef',
            600: '#c026d3',
            700: '#a21caf',
            800: '#86198f',
            900: '#701a75',
          },
          // Modo oscuro: azul/púrpura más neutro
          dark: {
            50: '#1e1b4b',
            100: '#312e81',
            200: '#3730a3',
            300: '#4338ca',
            400: '#5b21b6',
            500: '#7c3aed',
            600: '#8b5cf6',
            700: '#a78bfa',
            800: '#c4b5fd',
            900: '#ddd6fe',
          }
        },
        secondary: {
          // Modo claro: rosa
          light: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
            700: '#be185d',
            800: '#9d174d',
            900: '#831843',
          },
          // Modo oscuro: púrpura/gris más neutro
          dark: {
            50: '#374151',
            100: '#4b5563',
            200: '#6b7280',
            300: '#9ca3af',
            400: '#d1d5db',
            500: '#e5e7eb',
            600: '#f3f4f6',
            700: '#f9fafb',
            800: '#ffffff',
            900: '#ffffff',
          }
        }
      }
    },
  },
  plugins: [],
}
