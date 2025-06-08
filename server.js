import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup dirname for ES modules
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve webpage
app.use(express.static(path.join(dirname, 'public')));

// API routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'This is a test' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
