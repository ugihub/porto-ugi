import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

const browserGlobals = {
    atob: 'readonly',
    clearTimeout: 'readonly',
    clearInterval: 'readonly',
    console: 'readonly',
    document: 'readonly',
    fetch: 'readonly',
    FormData: 'readonly',
    IntersectionObserver: 'readonly',
    localStorage: 'readonly',
    navigator: 'readonly',
    requestAnimationFrame: 'readonly',
    setInterval: 'readonly',
    setTimeout: 'readonly',
    cancelAnimationFrame: 'readonly',
    URL: 'readonly',
    URLSearchParams: 'readonly',
    window: 'readonly'
}

const nodeGlobals = {
    global: 'readonly',
    process: 'readonly'
}

export default [
    {
        ignores: ['dist/**', 'node_modules/**', '.vercel/**']
    },
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                ...browserGlobals,
                ...nodeGlobals
            }
        },
        plugins: {
            react,
            'react-hooks': reactHooks
        },
        settings: {
            react: {
                version: 'detect'
            }
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/jsx-no-comment-textnodes': 'off',
            'react/no-unescaped-entities': 'off',
            'no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }]
        }
    }
]
