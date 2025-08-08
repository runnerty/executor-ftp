import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs'
    },
    ignores: ['.vscode', 'api', 'node_modules', 'samples', '**/*.md', '**/*.json', '.DS_Store', 'LICENSE'],
    plugins: { prettier },
    rules: {
      'prettier/prettier': ['error']
    }
  },
  prettierConfig
];
