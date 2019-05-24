const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    app: ['./src/index']
  },
  output: {
    path: __dirname + '/dist',//bundle.js가 저장될 경로
    filename: 'bundle.js',
  },
  target: 'node',
  module:{
    rules: [
      {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      options: {
        presets:[
          [
            '@babel/preset-env',{
              targets: {node: 'current'},
              modules: 'false'
            }
          ],
        ],
      },
      exclude: '/node_modules/',
      },
    ],
  },
  plugins: [],
  optimization: {},
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx'],
  },
};
