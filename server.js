import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllBlobs, getJsonBlob, setJsonBlob } from './blobjson.js';

// setup dirname for ES modules
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// serve webpage
app.use(express.static(path.join(dirname, 'public')));

// API routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'This is a test' });
});

app.get('/api/blobs', async (req, res) => {
  const blobs = await getAllBlobs();
  res.json(blobs);
});

app.get('/api/data', async (req, res) => {
  try {
    const jsonData = await getJsonBlob();
    res.json(jsonData);
  } catch (error) {
    console.error('Error fetching blob JSON:', error);
    res.status(500).send('Failed to fetch JSON from blob');
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const newData = req.body;
    await setJsonBlob(newData);
    res.status(200).send('JSON blob updated successfully');
  } catch (error) {
    console.error('Error updating blob JSON:', error);
    res.status(500).send('Failed to update JSON blob');
  }
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
