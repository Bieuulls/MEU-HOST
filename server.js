import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import themesRouter from './src/server/themes.js';
import productRoutes from './src/server/routes/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:5177'],
  credentials: true
}));
app.use(express.json());

// Serve uploaded files statically
// products.ts saves to public/uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

// Register routes
app.use('/themes', themesRouter);
app.use('/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
