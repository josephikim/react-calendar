import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import db from './db/connection';
import apiRouter from './api';
import { UserFacingError } from './utils/baseErrors';
import config from '../../webpack.dev.config.js';

const BUILD_DIR = __dirname;
const HTML_FILE = path.join(BUILD_DIR, 'index.html');
const PORT = process.env.PORT || 8080

const app = express();

// webpack dev middleware
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  logLevel: 'warn',
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
}))

// support data from POST requests
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// serve static files
app.use(express.static(BUILD_DIR));

// Use API routes
app.use('/api', apiRouter);

app.get('*', (req, res) => {
  res.sendFile(HTML_FILE);
});

// Global error handler
app.use(function (err, req, res, next) {
  if (err instanceof UserFacingError) {
    let error = {
      name: err.name,
      message: err.message
    }
    for (const [key, value] of Object.entries(err)) {
      error[key] = value;
    }

    res.status(err.statusCode).send(error);
  } else {
    res.status(500).send({ message: err });
  }

  // logger.error(err, 'Parameters: ', req.params, 'User data: ', req.user)
});

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
  console.log('Press Ctrl+C to quit.')
})