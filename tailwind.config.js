/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f8f3',
          100: '#ddeee1',
          200: '#bdddc4',
          300: '#90c49d',
          400: '#5fa56e',
          500: '#1b5e20', // Primary Green
          600: '#2e7d32',
          700: '#1b5e20',
          800: '#144317',
          900: '#0e2b10',
        },
        beige: {
          50: '#faf8f5',
          100: '#f5f0e6', // Primary Beige
          200: '#eddcc5',
          300: '#debfa2',
          400: '#cc9e7d',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
