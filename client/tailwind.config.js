/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0A0A0B',
          900: '#131316',
          800: '#1C1C21',
          700: '#2A2A31',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#FAFAFA',
          muted: '#F4F4F5',
        },
        line: {
          DEFAULT: '#E4E4E7',
          soft: '#EDEDF0',
        },
        text: {
          primary: '#18181B',
          secondary: '#71717A',
          tertiary: '#A1A1AA',
        },
        accent: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          400: '#6E86F0',
          DEFAULT: '#3E63DD',
          600: '#3151C4',
          700: '#2A439E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(24, 24, 27, 0.04), 0 1px 1px 0 rgba(24, 24, 27, 0.03)',
        card: '0 1px 3px 0 rgba(24, 24, 27, 0.06), 0 1px 2px -1px rgba(24, 24, 27, 0.04)',
        popover: '0 12px 32px -8px rgba(24, 24, 27, 0.18)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out both',
        pulseDot: 'pulseDot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
