import webpack from 'webpack';
import path from 'path';
import { fileURLToPath } from 'url';
import { merge } from 'webpack-merge';
import Dotenv from 'dotenv-webpack';
import nodeExternals from 'webpack-node-externals';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import common from './webpack.common.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const client = merge(common, {
  name: 'client',
  mode: 'development',
  target: 'web',
  entry: './src/client/index.js',
  devtool: 'source-map',
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
});

const server = merge(common, {
  name: 'server',
  mode: 'development',
  target: 'node',
  entry: './src/server/server-dev.js',
  output: {
    path: path.resolve('./build'),
    filename: 'server.cjs'
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'src')]
  },
  externals: [nodeExternals()],
  plugins: [
    new Dotenv({
      path: '.env.development'
    })
  ]
});

const config = [client, server];

export default config;
