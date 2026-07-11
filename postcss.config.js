export default {
  plugins: {
    /* CSS processing pipeline */
    // Vite reads CSS files ->
    // TailwindCSS expands @tailwind directives and generates all utility CSS ->
    // Autoprefixer adds necessary vendor prefixes based on browser compatibility requirements so CSS works across browsers
    tailwindcss: {},
    autoprefixer: {},
  },
};
