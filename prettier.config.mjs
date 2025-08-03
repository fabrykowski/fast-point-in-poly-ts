/**
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 80,
  trailingComma: 'none',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  arrowParens: 'avoid',
  importOrder: ['<THIRD_PARTY_MODULES>', '^\\$lib', '^\\.'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: [
    'typescript',
    'classProperties',
    'decorators-legacy'
  ],
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  overrides: [
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
        plugins: [
          'prettier-plugin-svelte',
          '@trivago/prettier-plugin-sort-imports'
        ]
      }
    }
  ]
};

export default config;
