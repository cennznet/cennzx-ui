module.exports = {
  //extends: '@plugnet/dev-react/config/babel',

  "presets": ["react-static/babel-preset.js", '@babel/preset-typescript'],
    "plugins" : [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          ['@babel/plugin-proposal-pipeline-operator', { proposal: 'fsharp' }],
          '@babel/plugin-proposal-object-rest-spread'
    ],
};