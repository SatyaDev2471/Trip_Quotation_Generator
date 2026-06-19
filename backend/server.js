import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import quotationRoutes from './routes/quotationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Mount API routes
app.use('/api/quotation', quotationRoutes);

// Server static files in production
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Fallback to SPA index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Backend Server] Running on port ${PORT}`);
});
