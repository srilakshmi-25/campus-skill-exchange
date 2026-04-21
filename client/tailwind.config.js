/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        admin: {
          bg:           '#0f172a',
          sidebar:      '#1e293b',
          card:         '#1e293b',
          border:       '#334155',
          accent:       '#6366f1',
          'accent-hover': '#818cf8',
          text:         '#f1f5f9',
          muted:        '#94a3b8',
          success:      '#10b981',
          danger:       '#ef4444',
          warning:      '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
