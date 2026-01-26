import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export type Product = {
  id: number;
  tenant_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string | null;
  barcode: string | null;
  weight: number | null;
  status: 'active' | 'draft';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type DatabaseError = Error & {
  code?: string;
  errno?: number;
};

const DB_FILE = 'database.sqlite';
const MAX_CONNECTIONS = 10;
const CONNECTION_TIMEOUT = 5000; // 5 seconds timeout
let connectionPool: Array<{ db: Database; inUse: boolean; lastUsed: number }> = [];

async function cleanupIdleConnections() {
  const now = Date.now();
  const IDLE_TIMEOUT = 300000; // 5 minutes

  connectionPool = await Promise.all(
    connectionPool.filter(async (conn) => {
      if (!conn.inUse && (now - conn.lastUsed) > IDLE_TIMEOUT) {
        try {
          await conn.db.close();
          return false;
        } catch (error) {
          console.error('Error closing idle connection:', error);
          return true;
        }
      }
      return true;
    })
  );
}

async function initializeTenantSchema(db: Database, tenantId: string) {
  // Placeholder for tenant schema initialization
}

export async function getConnection(tenantId: string): Promise<Database> {
  await cleanupIdleConnections();

  // Try to find an available connection in the pool
  const availableConnection = connectionPool.find(conn => !conn.inUse);
  if (availableConnection) {
    availableConnection.inUse = true;
    availableConnection.lastUsed = Date.now();
    return availableConnection.db;
  }

  // Create a new connection if pool is not full
  if (connectionPool.length < MAX_CONNECTIONS) {
    try {
      const db = await open({
        filename: DB_FILE,
        driver: sqlite3.Database,
      });

      // Enable foreign keys and WAL mode for better performance
      await db.exec('PRAGMA foreign_keys = ON');
      await db.exec('PRAGMA journal_mode = WAL');

      // Initialize tenant-specific schema if needed
      await initializeTenantSchema(db, tenantId);

      const connection = { db, inUse: true, lastUsed: Date.now() };
      connectionPool.push(connection);
      return db;
    } catch (error) {
      throw new Error(`Failed to create database connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Wait for an available connection if pool is full
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Connection timeout: No available connections in the pool'));
    }, CONNECTION_TIMEOUT);

    const checkConnection = async () => {
      const conn = connectionPool.find(c => !c.inUse);
      if (conn) {
        clearTimeout(timeout);
        conn.inUse = true;
        conn.lastUsed = Date.now();
        resolve(conn.db);
      } else {
        setTimeout(checkConnection, 100);
      }
    };

    checkConnection();
  });
}

export async function releaseConnection(db: Database) {
  const poolEntry = connectionPool.find(c => c.db === db);
  if (poolEntry) {
    poolEntry.inUse = false;
    poolEntry.lastUsed = Date.now();
  }
}

export async function closeAllConnections() {
  await Promise.all(connectionPool.map(async ({ db }) => {
    try {
      await db.close();
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }));
  connectionPool = [];
}

export async function initializeDatabase() {
  try {
    const db = await open({
      filename: DB_FILE,
      driver: sqlite3.Database
    });

    // Enable WAL mode and set busy timeout
    await db.exec('PRAGMA journal_mode = WAL');
    await db.exec(`PRAGMA busy_timeout = ${CONNECTION_TIMEOUT}`);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        sku TEXT,
        barcode TEXT,
        weight REAL,
        status TEXT DEFAULT 'active',
        is_featured BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
    `);

    await db.close();
    console.log('Database initialized successfully');
  } catch (error) {
    const dbError = error as DatabaseError;
    console.error('Error initializing database:', {
      message: dbError.message,
      code: dbError.code,
      errno: dbError.errno
    });
    throw new Error(`Database initialization failed: ${dbError.message}`);
  }
}

// Initialize database on application startup
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});
