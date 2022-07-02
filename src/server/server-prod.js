import path from 'path';
import express from 'express';
import cors from 'cors';

import db from './db/connection';
import apiRouter from './routers';
import { UserFacingError, DatabaseError } from './utils/baseErrors';
import { baseURL } from '../config/appConfig';

const BUILD_DIR = __dirname;
const HTML_FILE = path.join(BUILD_DIR, 'index.html');
const PORT = process.env.PORT || 8080;

const app = express();

// enable CORS for prod server
app.use(cors());

// support data from POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// serve static files
app.use(express.static(BUILD_DIR));

let indexRouter = express.Router();

indexRouter.get('/', function (req, res) {
  res.sendFile(HTML_FILE);
});

// Use API routes
indexRouter.use('/api', apiRouter);

// allow hosting express routes on a custom URL i.e. '/calendarapp'
app.use(baseURL, indexRouter);

// Global error handler
app.use(function (err, req, res, next) {
  if (err instanceof UserFacingError || err instanceof DatabaseError) {
    let error = {
      message: err.message
    };
    for (const [key, value] of Object.entries(err)) {
      error[key] = value;
    }
    res.status(err.statusCode).send(error);
  } else {
    let error = {
      name: err.name,
      message: err.message
    };

    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`App started, listening to ${PORT}....`);
  console.log('Press Ctrl+C to quit.');
});
