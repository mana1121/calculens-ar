/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: '#1565C0',
        secondary: '#42A5F5',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(21, 101, 192, 0.20)',
        'glow-lg': '0 0 40px rgba(21, 101, 192, 0.25)',
      },
    },
  },
  plugins: [],
}
