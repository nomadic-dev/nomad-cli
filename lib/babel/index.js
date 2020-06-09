
const path = require('path');
const { CLI_ROOT } = process.env;

const moduleType = process.env.JEST === 'true' && process.env.NODE_ENV === 'test' ? 'commonjs' : 'false';

module.exports = {
  ignore: [/\bcore-js\b/],
  sourceType: 'unambiguous',
  presets: [
    [
			path.join(CLI_ROOT, 'node_modules/@babel/preset-env'),
      {
        debug: process.env.JEST !== 'true',
        modules: moduleType,
        useBuiltIns: 'usage',
        shippedProposals: true,
        corejs: 2,
        exclude: ['transform-typeof-symbol']
      }
    ],
		path.join(CLI_ROOT, 'node_modules/@babel/preset-react'),
		path.join(CLI_ROOT, 'node_modules/@babel/preset-typescript')
  ],
  plugins: [
		[path.join(CLI_ROOT, 'node_modules/@babel/plugin-proposal-class-properties'), { loose: true }],
		[path.join(CLI_ROOT, 'node_modules/@babel/plugin-syntax-dynamic-import')],
		[path.join(CLI_ROOT, 'node_modules/@babel/plugin-proposal-optional-chaining')],
		[path.join(CLI_ROOT, 'node_modules/@babel/plugin-proposal-nullish-coalescing-operator'), { loose: false }],
		[path.join(CLI_ROOT, 'node_modules/babel-plugin-styled-components'), { displayName: true }],
		[path.join(CLI_ROOT, 'node_modules/babel-plugin-transform-react-styled-components-qa')],
		[path.join(CLI_ROOT, 'node_modules/babel-plugin-transform-react-qa-attributes')]
  ],
  env: {
    test: {
			plugins: [[path.join(CLI_ROOT, 'node_modules/babel-plugin-transform-react-remove-prop-types')]]
    },
    uat: {
			plugins: [[path.join(CLI_ROOT, 'node_modules/babel-plugin-transform-react-remove-prop-types')]]
    },
    production: {
      plugins: [
        [
					path.join(CLI_ROOT, 'node_modules/babel-plugin-transform-react-remove-prop-types'),
          { removeImport: true }
        ]
      ]
    }
  }
};
