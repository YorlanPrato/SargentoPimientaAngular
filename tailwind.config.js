/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        foreground: '#F5F5F4',
        card: '#1E1E1E',
        'card-foreground': '#F5F5F4',
        muted: '#2A2A2A',
        'muted-foreground': '#A8A8A8',
        primary: '#F59E0B',
        'primary-foreground': '#121212',
        destructive: '#DC2626',
        border: 'rgba(245, 245, 244, 0.1)',
        ring: '#F59E0B',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [],
}
