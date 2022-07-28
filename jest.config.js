import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default {
  rootDir: '.',
  moduleDirectories: ['node_modules', path.join(__dirname, 'src')]
};
