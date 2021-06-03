const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = (env, argv) => {
  const SERVER_PATH = (argv.mode === 'production') ?
    './src/server/server-prod.js' :
    './src/server/server-dev.js'
  
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
    externals: [nodeExternals()], // Need this to avoid error when working with Express
    module: {
      rules: [
        {
          // Transpiles ES6-8 into ES5
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        }
      ]
    }
  })
}