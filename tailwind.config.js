/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      'brand-one': '#7C5DFA',
      'brand-two': '#9277FF',
      'brand-three': '#1E2139',
      'brand-four': '#252945',
      'brand-five': '#DFE3FA',
      'brand-six': '#7E88C3',
      'brand-seven': '#7E88C3',
      'brand-eight': '#0C0E16',
      'brand-twelve': '#141625',
      'brand-dark-purple': '#7C5DFA',
      'light-sidebar': '#373B53',
      'dark-sidebar': '#1E2139',
      'dark-gray': '#888EB0',

    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
