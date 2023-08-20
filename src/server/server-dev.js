import path from 'path';
import express from 'express';
import cors from 'cors';

import db from './db/connection';
import router from './routers';
import { UserFacingError, DatabaseError } from './utils/baseErrors';

const BUILD_DIR = __dirname;
const HTML_FILE = path.resolve(BUILD_DIR, 'index.html');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());

// support data from POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// serve static files
app.use(express.static(BUILD_DIR));

// Use API routes
app.use('/api/v1', router);

app.get('*', (req, res) => {
  res.sendFile(HTML_FILE);
});

// Global error handler
app.use(function (err, req, res, next) {
  res.header('Content-Type', 'application/json');

  const status = err.status || 400;

  const response = {
    name: err.name,
    message: err.message ?? ''
  };

  if (err instanceof UserFacingError || err instanceof DatabaseError) {
    for (const [key, value] of Object.entries(err)) {
      response[key] = value;
    }
  }

  res.status(status).send(response);
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
