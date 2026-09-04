/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F1EEE2',
        'paper-dark': '#E6E0C9',
        spine: '#6B1B24',
        'spine-dark': '#4E1219',
        ink: '#1E2A38',
        'ink-light': '#5B6779',
        rule: '#C9C1A6',
        gold: '#A6862E',
        seal: {
          green: '#2F6F4E',
          amber: '#A9762A',
          red: '#A13D2C',
        },
      },
      fontFamily: {
        serif: ['"IBM Plex Serif"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        stampIn: {
          '0%': { transform: 'scale(2.4) rotate(-16deg)', opacity: '0' },
          '55%': { transform: 'scale(0.92) rotate(-5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-6deg)', opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        stamp: 'stampIn 0.55s cubic-bezier(.2,.8,.3,1.1)',
        fadeUp: 'fadeUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
