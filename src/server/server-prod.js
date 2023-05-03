import path from 'path';
import express from 'express';
import cors from 'cors';

import db from './db/connection';
import router from './routers';
import { UserFacingError, DatabaseError } from './utils/baseErrors';
import { baseURL } from 'config/appConfig';

const BUILD_DIR = __dirname;
const HTML_FILE = path.resolve(BUILD_DIR, 'index.html');
const PORT = process.env.PORT || 3001;

const app = express();

// enable CORS for prod server
app.use(cors());

// support data from POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// serve static files
app.use(express.static(BUILD_DIR));

const indexRouter = express.Router();

indexRouter.get('/', function (req, res) {
  res.sendFile(HTML_FILE);
});

// Use API routes
indexRouter.use('/api', router);

// allow hosting express routes on a custom URL i.e. '/calendarapp'
app.use(baseURL, indexRouter);

// Global error handler
app.use(function (err, req, res) {
  const response = {
    message: err.message
  };

  if (err instanceof UserFacingError || err instanceof DatabaseError) {
    for (const [key, value] of Object.entries(err)) {
      response[key] = value;
    }
    res.status(err.statusCode).send(response);
  } else {
    response.name = err.name;
    res.status(500).send(response);
  }
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
