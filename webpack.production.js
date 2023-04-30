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
  devtool: 'source-map',
  output: {
    path: path.resolve('./build'),
    filename: 'bundle.js',
    publicPath: '/calendarapp'
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '/assets'
          }
        }
      }
    ]
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'src')]
  },
  plugins: [
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
      path: '.env.production'
    })
  ]
};

const server = {
  name: 'server',
  target: 'node',
  entry: './src/server/server-prod.js',
  devtool: 'source-map',
  output: {
    path: path.resolve('./build'),
    filename: 'server.js'
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'src')]
  },
  externals: [nodeExternals()],
  plugins: [
    new Dotenv({
      path: '.env.production'
    })
  ]
};

module.exports = [merge(commonClientConfig, client), server];
