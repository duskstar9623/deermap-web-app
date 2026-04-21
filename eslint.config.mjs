import type { Config } from 'eslint'

const config: Config = [
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      'next/core-web-vitals',
      'prettier',
    ],
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      'react/display-name': 'off',
    },
  },
]

export default config
