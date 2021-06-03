import path from 'path';
import express from 'express';

import db from './db/connection';
import apiRouter from './api';

const app = express();
const BUILD_DIR = __dirname;
const HTML_FILE = path.join(BUILD_DIR, 'index.html');

// support data from POST requests
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// serve static files
app.use(express.static(BUILD_DIR));

// Use API routes
app.use("/api", apiRouter);

app.get('/', function (req,res) {
  res.sendFile(HTML_FILE);
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
  console.log('Press Ctrl+C to quit.')
})