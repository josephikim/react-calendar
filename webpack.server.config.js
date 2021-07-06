const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  const SERVER_PATH = isProduction ?
    './src/server/server-prod.js' :
    './src/server/server-dev.js'
  const ENV_PATH = isProduction ?
    '.env.production' :
    '.env.development'

  return ({
    entry: {
      server: SERVER_PATH
    },
    output: {
      path: path.join(__dirname, 'build'),
      publicPath: '/',
      filename: '[name].js'
    },
    mode: argv.mode,
    target: 'node',
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          // Transpiles ES6-8 into ES5
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    },
    plugins: [
      new Dotenv({
        path: ENV_PATH,
      })
    ],
  })
}