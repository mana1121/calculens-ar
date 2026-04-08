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
        // ── Existing blue theme (preserved for Phase 1) ───────────────
        primary: '#1565C0',
        secondary: '#42A5F5',

        // ── PITRAM Premium Purple — Background Layer ──────────────────
        'bg-base': '#0A0118',
        'bg-deep': '#1A0B2E',
        'bg-card': '#241039',

        // ── PITRAM Premium Purple — Brand Spectrum ────────────────────
        'pitram-purple': {
          900: '#2D1B5E',
          800: '#3D2470',
          700: '#4A2D8C',
          600: '#5B36A8',
          500: '#6B3FA0', // PITRAM main color
          400: '#8B5CF6', // electric purple — most CTAs
          300: '#A78BFA', // lavender — hover states
          200: '#C4B5FD', // mist purple
          100: '#DDD6FE', // lightest tint
        },

        // ── PITRAM Cyan Accent ────────────────────────────────────────
        'pitram-cyan': {
          glow: '#14B8A6',   // PITRAM tagline color
          bright: '#2DD4BF',
          mint: '#5EEAD4',
        },

        // ── PITRAM Text Colors ────────────────────────────────────────
        'pitram-text': {
          primary: '#FFFFFF',
          secondary: '#E5E7EB',
          tertiary: '#9CA3AF',
          muted: '#6B7280',
        },
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
        'gradient-pitram': 'linear-gradient(135deg, #6B3FA0 0%, #8B5CF6 50%, #A78BFA 100%)',
        'shimmer': 'linear-gradient(110deg, transparent 25%, rgba(167, 139, 250, 0.4) 50%, transparent 75%)',
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
      },
      boxShadow: {
        // ── Existing blue glows (preserved) ───────────────────────────
        glow: '0 0 20px rgba(21, 101, 192, 0.20)',

        // ── PITRAM Purple Glows (new) ─────────────────────────────────
        'glow-sm': '0 0 12px rgba(139, 92, 246, 0.25)',
        'glow-md': '0 0 20px rgba(139, 92, 246, 0.35), 0 0 40px rgba(139, 92, 246, 0.20)',
        'glow-lg': '0 0 30px rgba(139, 92, 246, 0.45), 0 0 60px rgba(139, 92, 246, 0.25), 0 0 100px rgba(139, 92, 246, 0.15)',
        'glow-cyan': '0 0 20px rgba(20, 184, 166, 0.40), 0 0 40px rgba(20, 184, 166, 0.20)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.30)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.60)' },
        },
      },
      animation: {
        shimmer: 'shimmer 8s ease infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
