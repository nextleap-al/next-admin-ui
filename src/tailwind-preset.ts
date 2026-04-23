/**
 * Tailwind preset for @nextleap-al/admin-ui.
 *
 * Consumers should add this preset to their `tailwind.config.js`:
 *
 *   import nextuiPreset from '@nextleap-al/admin-ui/tailwind-preset';
 *   export default {
 *     presets: [nextuiPreset],
 *     content: [
 *       './src/**\/*.{ts,tsx}',
 *       './node_modules/@nextleap-al/admin-ui/dist/**\/*.{js,mjs}',
 *     ],
 *   };
 *
 * The preset exposes the default NextLeap color scales (`primary`, `gold`)
 * AND maps `surface-*`, status colors, shadows, spacing, etc. to CSS
 * variables declared in `@nextleap-al/admin-ui/tokens.css`. Override the CSS
 * variables at `:root` in your app to theme the library without rebuilding.
 */

import type { Config } from 'tailwindcss';

const preset: Partial<Config> = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--nl-primary-50, #ecfdf3)',
          100: 'var(--nl-primary-100, #d1fae3)',
          200: 'var(--nl-primary-200, #a6f4c9)',
          300: 'var(--nl-primary-300, #6de9a6)',
          400: 'var(--nl-primary-400, #44d269)',
          500: 'var(--nl-primary-500, #3ab45a)',
          600: 'var(--nl-primary-600, #0f9d3c)',
          700: 'var(--nl-primary-700, #0d7b32)',
          800: 'var(--nl-primary-800, #0e612a)',
          900: 'var(--nl-primary-900, #0c5025)',
          950: 'var(--nl-primary-950, #042c12)',
        },
        gold: {
          50: 'var(--nl-gold-50, #fdf8eb)',
          100: 'var(--nl-gold-100, #f9eecf)',
          200: 'var(--nl-gold-200, #f3dca0)',
          300: 'var(--nl-gold-300, #edc86d)',
          400: 'var(--nl-gold-400, #c5982d)',
          500: 'var(--nl-gold-500, #bc8821)',
          600: 'var(--nl-gold-600, #b57918)',
          700: 'var(--nl-gold-700, #8d5d14)',
          800: 'var(--nl-gold-800, #744c14)',
          900: 'var(--nl-gold-900, #604016)',
          950: 'var(--nl-gold-950, #362108)',
        },
        surface: {
          50: 'var(--surface-50)',
          100: 'var(--surface-100)',
          200: 'var(--surface-200)',
          300: 'var(--surface-300)',
          400: 'var(--surface-400)',
          500: 'var(--surface-500)',
          600: 'var(--surface-600)',
          700: 'var(--surface-700)',
          800: 'var(--surface-800)',
          900: 'var(--surface-900)',
        },
      },
      fontFamily: {
        sans: ['var(--nl-font-sans, "Chillax")', 'system-ui', 'sans-serif'],
        display: ['var(--nl-font-display, "Chillax")', 'system-ui', 'sans-serif'],
        mono: ['var(--nl-font-mono, "JetBrains Mono")', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        glass: '0 0 20px 0 rgba(0, 0, 0, 0.05)',
        'glass-lg': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        glow: '0 0 24px -4px var(--primary-glow, rgba(68, 210, 105, 0.3))',
        'gold-glow': '0 0 24px -4px var(--secondary-glow, rgba(197, 152, 45, 0.3))',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        shimmer: 'shimmer 2s infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spinSlow 1.2s linear infinite',
      },
      keyframes: {
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};

export default preset;
