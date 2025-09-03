// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/components/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         gold: {
//           50: '#fffbeb',
//           100: '#fef3c7',
//           200: '#fde68a',
//           300: '#fcd34d',
//           400: '#f59e0b',
//           500: '#d97706',
//           600: '#b45309',
//           700: '#92400e',
//           800: '#78350f',
//           900: '#451a03',
//         },
//         wine: {
//           50: '#fdf2f8',
//           100: '#fce7f3',
//           200: '#fbcfe8',
//           300: '#f9a8d4',
//           400: '#7c2d12',
//           500: '#991b1b',
//           600: '#7f1d1d',
//           700: '#450a0a',
//           800: '#3c0a0a',
//           900: '#2d0a0a',
//         }
//       },
//       fontFamily: {
//         'playfair': ['var(--font-playfair)', 'serif'],
//         'dm-serif': ['var(--font-dm-serif)', 'serif'],
//       },
//       animation: {
//         'float': 'float 6s ease-in-out infinite',
//         'spin-slow': 'spin 20s linear infinite',
//         'twinkle': 'twinkle 2s ease-in-out infinite',
//         'sway': 'sway 4s ease-in-out infinite',
//         'glow': 'glow 3s ease-in-out infinite',
//       },
//       keyframes: {
//         float: {
//           '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
//           '33%': { transform: 'translateY(-10px) rotate(5deg)' },
//           '66%': { transform: 'translateY(5px) rotate(-3deg)' },
//         },
//         twinkle: {
//           '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
//           '50%': { opacity: '0.8', transform: 'scale(1.2)' },
//         },
//         sway: {
//           '0%, 100%': { transform: 'rotate(12deg)' },
//           '50%': { transform: 'rotate(-12deg)' },
//         },
//         glow: {
//           '0%, 100%': { 
//             boxShadow: '0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(124, 45, 18, 0.2), 0 0 60px rgba(212, 175, 55, 0.1)' 
//           },
//           '50%': { 
//             boxShadow: '0 0 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(124, 45, 18, 0.3), 0 0 90px rgba(212, 175, 55, 0.2)' 
//           },
//         },
//       },
//     },
//   },
//   plugins: [],
// }