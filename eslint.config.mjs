import antfu from '@antfu/eslint-config'

export default antfu({
  nextjs: true,
  rules: {
    // Retain the existing compact formatting when upgrading the preset.
    'antfu/reasonable-newline': 'off',
  },
  stylistic: {
    overrides: {
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: 'directive',
          next: '*',
        },
      ],
    },
  },
  imports: {
    overrides: {
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'type-import',
            'value-builtin',
            'value-external',
            'value-internal',
            ['value-parent', 'value-sibling', 'value-index'],
            'side-effect',
            'unknown',
          ],
          newlinesBetween: 1,
        },
      ],
    },
  },
})
