import type { Config } from 'tailwindcss';
import nextleapPreset from '../src/tailwind-preset';

export default {
  presets: [nextleapPreset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../src/**/*.{ts,tsx}',
  ],
} satisfies Config;
