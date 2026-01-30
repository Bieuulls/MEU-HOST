import express from 'express';
import cors from 'cors';
import themesRouter from './src/server/themes';
import productRoutes from './src/server/routes/products';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './src/lib/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:5177'],
  credentials: true
}));
app.use(express.json());

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

// Register routes
app.use('/themes', themesRouter);
app.use('/products', productRoutes);

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

startServer();
