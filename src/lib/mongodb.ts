
import { MongoClient, Db, Collection } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!process.env.MONGODB_DB_NAME) {
  throw new Error('Please define the MONGODB_DB_NAME environment variable inside .env.local');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

let client: MongoClient;
let db: Db;

interface CachedConnection {
  client: MongoClient | null;
  db: Db | null;
}

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections from growing exponentially
// during API Route usage.
let cached: CachedConnection = (global as any).mongo;

if (!cached) {
  cached = (global as any).mongo = { client: null, db: null };
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.client && cached.db) {
    try {
      // Ping the database to check if connection is still alive
      await cached.client.db('admin').command({ ping: 1 });
      console.log("Using cached MongoDB connection.");
      return { client: cached.client, db: cached.db };
    } catch (e) {
      // Connection lost, clear cache and reconnect
      console.warn('MongoDB cached connection ping failed, attempting to reconnect...', e);
      cached.client = null;
      cached.db = null;
    }
  }

  if (!cached.client) {
    try {
      console.log("Attempting new MongoDB connection to URI:", uri.substring(0, uri.indexOf('@') > 0 ? uri.indexOf('@') : 30) + "..." ); // Log URI safely
      client = new MongoClient(uri);
      await client.connect();
      cached.client = client;
      console.log("Successfully connected to MongoDB Atlas!");
    } catch (e) {
      console.error("Failed to connect to MongoDB Atlas", e);
      throw e; // Rethrow error to be caught by caller
    }
  }
  
  db = cached.client.db(dbName);
  cached.db = db;
  console.log(`Connected to MongoDB database: ${dbName}`);

  return { client: cached.client, db: cached.db };
}

export async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(collectionName);
}
