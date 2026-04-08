/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#1F6B4F',
          'green-dark': '#154A37',
          orange: '#F28C28',
          cream: '#F7F5EF',
        },
      },
      boxShadow: {
        card: '0 10px 25px -12px rgba(21, 74, 55, 0.35)',
      },
    },
  },
  plugins: [],
}

