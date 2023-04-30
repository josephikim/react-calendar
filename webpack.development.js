const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const nodeExternals = require('webpack-node-externals');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const commonClientConfig = require('./webpack.common.js');

const client = {
  name: 'client',
  target: 'web',
  entry: './src/client/index.js',
  devtool: 'inline-source-map',
  devServer: {
    port: 8080,
    historyApiFallback: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets'
          }
        }
      }
    ]
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'src')]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebPackPlugin({
      template: 'src/client/index.html',
      filename: './index.html',
      excludeChunks: ['server']
    }),
    new Dotenv({
      path: '.env.development'
    })
  ]
};

const server = {
  name: 'server',
  target: 'node',
  entry: ['webpack/hot/poll?1000', './src/server/server-dev.js'],
  output: {
    path: path.resolve('./build'),
    filename: 'server.js'
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'src')]
  },
  externals: [nodeExternals({ allowlist: ['webpack/hot/poll?1000'] })],
  plugins: [
    new Dotenv({
      path: '.env.development'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  node: {
    global: false,
    __filename: false,
    __dirname: false
  }
};

module.exports = [merge(commonClientConfig, client), server];
