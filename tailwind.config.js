/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', 'Georgia', 'serif']
      },
      colors: {
        cream: '#fffaf2',
        linen: '#f4e9d8',
        sage: '#8fa58b',
        moss: '#465c43',
        terracotta: '#bd6545',
        ink: '#26221f',
        clay: '#d9a07f'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(86, 61, 42, 0.14)'
      }
    }
  },
  plugins: []
};
