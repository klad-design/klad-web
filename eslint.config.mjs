import antfu from '@antfu/eslint-config'

export default antfu({
  nextjs: true,
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
            'type',
            ['parent-type', 'sibling-type', 'index-type', 'internal-type'],
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'side-effect',
            'object',
            'unknown',
          ],
          newlinesBetween: 'always',
        },
      ],
    },
  },
})
