/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
    root: true,
    extends: [
        './scripts/eslint/nx.js',
        '@tinkoff/eslint-config-angular',
        '@tinkoff/eslint-config-angular/html',
        '@tinkoff/eslint-config-angular/rxjs',
    ],
    ignorePatterns: [
        'projects/**/test.ts',
        'projects/**/icons/all.ts',
        '*.js',
        '*.json',
        '*.less',
        '*.md',
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: [require.resolve('./tsconfig.eslint.json')],
    },
    parser: '@typescript-eslint/parser',
    rules: {
        '@typescript-eslint/no-useless-constructor': 'off',
        'no-prototype-builtins': 'off',
        '@typescript-eslint/await-thenable': 'error',
        'require-await': 'error',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/no-unnecessary-type-constraint': 'error',
        '@typescript-eslint/prefer-includes': 'error',
        'prefer-template': 'error',
        '@typescript-eslint/array-type': [
            'error',
            {default: 'array', readonly: 'array-simple'},
        ],
    },
};
