import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['packages/plugin-intern/**/*.ts'],
    rules: {},
  },
];
