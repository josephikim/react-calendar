import path from 'path';
import express from 'express';
import webpack from 'webpack';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import db from './db/connection';
import config from '../../webpack.dev.config.js';
import apiRouter from './routers/apiRouter.js';
import appRouter from './routers/appRouter.js';

const app = express();
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.use('/api', apiRouter);
app.use('/', appRouter);

app.get('*', (req, res, next) => {
  const HTML_FILE = path.resolve(compiler.outputPath, 'index.html');
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
    if (err) {
      return next(err)
    }
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
    })
})
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
  console.log('Press Ctrl+C to quit.')
})