import path from 'path';
import express from 'express';
import cors from 'cors';

import db from './db/connection';
import apiRouter from './api';

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

// Use API routes
app.use('/api', apiRouter);

app.get('*', function (req, res) {
  console.log('app.get ("*") req.hostname:', req.hostname);
  console.log('app.get ("*") req.path:', req.path);
  console.log('app.get ("*") req.originalUrl:', req.originalUrl);
  // console.log('app.get ("*") req.body:', req.body);
  res.sendFile(HTML_FILE);
});

app.listen(PORT, () => {
  console.log(`Server-prod started, listening to ${PORT}....`);
  console.log('Press Ctrl+C to quit.');
});
