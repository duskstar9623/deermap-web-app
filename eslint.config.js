import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),        // 全局忽略 dist 目录，不对其进行任何 lint 检查。
  {
    files: ['**/*.{ts,tsx}'],     // 仅对业务代码进行 lint 检查，排除测试文件和配置文件等
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,   // 声明浏览器环境全局变量定义，确保在 lint 检查时不会误报未定义的全局变量
    },
  },
])
