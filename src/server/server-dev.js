import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import db from './db/connection';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import calendarRouter from './routes/calendar.js';

import config from '../../webpack.dev.config.js';
import errorController from './controllers/errorController';

const app = express();
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.json());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/calendar', calendarRouter);

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

app.use(errorController);

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
  console.log('Press Ctrl+C to quit.')
})