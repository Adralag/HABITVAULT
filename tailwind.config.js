/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors from requirements
        primary: '#0F172A',    // Navy Blue
        accent: '#14B8A6',     // Teal
        secondary: '#22D3EE',  // Cyan
        background: {
          light: '#FFFFFF',    // White for light mode
          dark: '#0F172A',     // Navy Blue for dark mode
        },
        card: {
          light: '#FFFFFF',
          dark: '#1E293B',     // Darker blue for dark mode cards
        },
        text: {
          light: '#334155',    // Slate gray for light mode
          dark: '#F1F5F9',     // Light gray for dark mode
        },
        muted: {
          light: '#64748B',    // Muted text for light mode
          dark: '#94A3B8',     // Muted text for dark mode
        },
      },
      fontFamily: {
        // Typography from requirements
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        nunito: ['Nunito Sans', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
      },
      gradientColorStops: {
        'accent-gradient-start': '#14B8A6', // Teal
        'accent-gradient-end': '#22D3EE',   // Cyan
      },
    },
  },
  plugins: [],
}

