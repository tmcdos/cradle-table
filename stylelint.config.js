module.exports = {
  extends:
  [
    'stylelint-config-standard-scss',
    'stylelint-config-standard-vue/scss'
  ],
  overrides: [
    {
      files: ['*.{html,vue}', '**/*.{html,vue}'],
      customSyntax: 'postcss-html',
    },
  ],
  rules:
   {
     'selector-class-pattern': null,
     'no-empty-source': null,
     'number-no-trailing-zeros': null,
     'color-hex-case': 'upper',
     'color-hex-length': 'long',
     'comment-empty-line-before': null,
     'block-opening-brace-space-before': null,
     'block-opening-brace-newline-after': 'always-multi-line',
     'block-opening-brace-newline-before': 'always-multi-line',
     'length-zero-no-unit': null,
     'alpha-value-notation': 'number',
     'color-function-notation': 'legacy',
     'no-descending-specificity': null, // TODO: should be revised
     'at-rule-no-unknown': null,
     'at-rule-empty-line-before': null,
     indentation: 2,
     'max-line-length': [200, {
       ignore: ['comments']
     }],
     'scss/at-rule-no-unknown': true,
     'scss/dollar-variable-empty-line-before': null,
     'scss/dollar-variable-colon-space-before': null
   }
};
