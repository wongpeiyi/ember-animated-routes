'use strict';

module.exports = {
  trailingComma: 'none',
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  overrides: [
    {
      files: '*.hbs',
      options: {
        singleQuote: false
      }
    }
  ]
};
