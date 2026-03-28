export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0F766E', 50: '#F0FDFA', 100: '#CCFBF1', 500: '#14B8A6', 700: '#0F766E', 900: '#134E4A' },
        secondary: { DEFAULT: '#F59E0B', 100: '#FEF3C7', 500: '#F59E0B', 700: '#B45309' }
      }
    }
  },
  plugins: []
}
