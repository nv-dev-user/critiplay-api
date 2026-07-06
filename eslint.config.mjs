import tseslint from 'typescript-eslint'
import hono from '@hono/eslint-config'

export default tseslint.config(
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            'supabase/**',
            '*.config.ts',
            '*.config.mjs'
        ]
    },
    ...hono,
    {
        files: ['**/*.ts', '**/*.mts'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname
            }
        }
    },
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            'import-x/consistent-type-specifier-style': 'off'
        }
    }
)