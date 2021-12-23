const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const ENV_PATH = isProduction ? '.env.production' : '.env.development';
  const plugins = [
    new Dotenv({
      path: ENV_PATH
    })
  ];

  if (!isProduction) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  const ENTRY_PATH = isProduction
    ? './src/server/server-prod.js'
    : ['webpack/hot/poll?1000', './src/server/server-dev.js'];

  return {
    entry: {
      server: ENTRY_PATH
    },
    output: {
      path: path.join(__dirname, 'build'),
      publicPath: '/',
      filename: '[name].js'
    },
    mode: argv.mode,
    target: 'node',
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?1000']
      })
    ],
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
    plugins: plugins,
    node: {
      __dirname: false,
      __filename: false
    }
  };
};
