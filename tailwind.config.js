import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],     // Files Tailwind scans during the build to extract class names and generate the corresponding CSS
  future: {
    hoverOnlyWhenSupported: true,                       // Enable hover styles only when the browser supports hover, improving performance and user experience
  },
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          light: 'rgb(var(--color-accent-light) / <alpha-value>)',
        },
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        genomics: 'rgb(var(--color-genomics) / <alpha-value>)',
        transcriptomics: 'rgb(var(--color-transcriptomics) / <alpha-value>)',
        proteomics: 'rgb(var(--color-proteomics) / <alpha-value>)',
        metabolomics: 'rgb(var(--color-metabolomics) / <alpha-value>)',
      },
    },
  },
  plugins: [animate],
};
