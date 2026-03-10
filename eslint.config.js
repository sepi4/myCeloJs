const js = require('@eslint/js')
const tseslint = require('typescript-eslint')
const globals = require('globals')
const reactPlugin = require('eslint-plugin-react')
const reactHooksPlugin = require('eslint-plugin-react-hooks')
const jestPlugin = require('eslint-plugin-jest')
const prettierConfig = require('eslint-config-prettier')

module.exports = tseslint.config(
    js.configs.recommended,
    tseslint.configs.recommended,
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat['jsx-runtime'],
    reactHooksPlugin.configs.flat['recommended-latest'],
    prettierConfig,
    {
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            'react-hooks/set-state-in-effect': 'off',
        },
    },
    {
        files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
        ...jestPlugin.configs['flat/recommended'],
    },
    {
        files: ['src/main/**/*.ts', 'src/preload/**/*.ts'],
        languageOptions: {
            globals: globals.node,
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
    {
        ignores: [
            'node_modules/',
            'dist/',
            'out/',
            'release-builds/',
            'e2e/',
            'dataExamples/',
            'localhostFiles/',
            'playwright-report/',
            'test-results/',
            'readmeImages/',
            'eslint.config.js',
            'jest.config.js',
            'electron.vite.config.ts',
            'playwright.config.ts',
            '.prettierrc.js',
        ],
    }
)
