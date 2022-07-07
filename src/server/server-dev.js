import path from 'path';
import express from 'express';
import cors from 'cors';

import db from './db/connection';
import apiRouter from './routers';
import { UserFacingError, DatabaseError } from './utils/baseErrors';

const BUILD_DIR = __dirname;
const HTML_FILE = path.join(BUILD_DIR, 'index.html');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());

// support data from POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// serve static files
app.use(express.static(BUILD_DIR));

// Use API routes
app.use('/api', apiRouter);

app.get('*', (req, res) => {
  res.sendFile(HTML_FILE);
});

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
  console.log(`server started at http://localhost:${PORT}`);
});

if (module.hot) module.hot.accept();
