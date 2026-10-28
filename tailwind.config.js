/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0C1527',
          DEFAULT: '#101C35',
          800: '#192A49',
          700: '#23385F',
        },
        primary: {
          50: '#EEF4FF',
          100: '#E0EBFF',
          500: '#356AE6',
          600: '#2654C4',
          700: '#1D4099',
          DEFAULT: '#356AE6',
        },
        teal: {
          50: '#E8F9F7',
          500: '#20B8A5',
          600: '#169989',
          DEFAULT: '#20B8A5',
        },
        app: {
          bg: '#F5F7FB',
          surface: '#FFFFFF',
          text: '#182338',
          muted: '#68758A',
          border: '#E4E9F1',
        },
        status: {
          success: '#16845B',
          warning: '#D99520',
          danger: '#D94F59',
          info: '#356AE6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(16, 28, 53, 0.04), 0 1px 3px rgba(16, 28, 53, 0.02)',
        'card-hover': '0 12px 28px rgba(16, 28, 53, 0.08), 0 4px 10px rgba(16, 28, 53, 0.04)',
        'elevated': '0 20px 40px -15px rgba(16, 28, 53, 0.12)',
        'glow-blue': '0 0 25px rgba(53, 106, 230, 0.35)',
        'glow-teal': '0 0 25px rgba(32, 184, 165, 0.35)',
      }
    },
  },
  plugins: [],
}
