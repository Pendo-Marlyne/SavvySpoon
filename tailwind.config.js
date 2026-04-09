/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // primary action green
          green: '#256F5B',
          'green-dark': '#1E5948',
          // warm accent orange
          orange: '#F4A259',
          // soft cream background
          cream: '#FFF6E9',
        },
      },
      boxShadow: {
        card: '0 18px 45px -24px rgba(38, 87, 71, 0.55)',
      },
    },
  },
  plugins: [],
}

