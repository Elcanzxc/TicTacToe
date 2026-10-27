/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0b0d13',
          surface: '#11141e',
          card: '#161b26',
          border: '#232b3e',
          borderGlow: '#2e3a54',
          subtext: '#7e8b9f',
          text: '#f1f5f9',
        },
        neon: {
          cyan: '#00f0ff',
          cyanGlow: 'rgba(0, 240, 255, 0.35)',
          rose: '#ff0055',
          roseGlow: 'rgba(255, 0, 85, 0.35)',
          amber: '#ffaa00',
          purple: '#a855f7',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.4), inset 0 0 10px rgba(0, 240, 255, 0.15)',
        'neon-cyan-lg': '0 0 35px rgba(0, 240, 255, 0.6), inset 0 0 15px rgba(0, 240, 255, 0.25)',
        'neon-rose': '0 0 20px rgba(255, 0, 85, 0.4), inset 0 0 10px rgba(255, 0, 85, 0.15)',
        'neon-rose-lg': '0 0 35px rgba(255, 0, 85, 0.6), inset 0 0 15px rgba(255, 0, 85, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      fontFamily: {
        cyber: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
};

