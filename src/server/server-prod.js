import path from 'path';
import express from 'express';

const app = express();

const PUBLIC_DIR = path.join(process.cwd(), '/build');
const HTML_FILE = path.join(PUBLIC_DIR, '/index.html');;

app.use(express.static(PUBLIC_DIR))
app.get('*', (req, res) => {
  res.sendFile(HTML_FILE)
})
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
  console.log('Press Ctrl+C to quit.')
})