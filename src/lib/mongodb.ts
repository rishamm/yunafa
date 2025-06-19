'use server';

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

let cached: CachedConnection = (global as any).mongo;

if (!cached) {
  cached = (global as any).mongo = { client: null, db: null };
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.client && cached.db) {
    try {
      await cached.client.db('admin').command({ ping: 1 });
      console.log("MongoDB: Ping successful. Using cached connection.");
      return { client: cached.client, db: cached.db };
    } catch (e) {
      console.warn('MongoDB: Cached connection ping FAILED. Clearing cache and attempting to reconnect...', e);
      cached.client = null;
      cached.db = null;
    }
  }

  // This block handles new connections OR reconnections after a failed ping
  if (!cached.client) {
    console.log("MongoDB: No active cached client. Attempting a new connection...");
    const safeUriToLog = uri.substring(0, uri.indexOf('@') > 0 ? uri.indexOf('@') : 30) + "...";
    try {
      console.log(`MongoDB: Connecting to URI: ${safeUriToLog} for DB: ${dbName}`);
      client = new MongoClient(uri);
      await client.connect();
      cached.client = client;
      console.log("MongoDB: NEW CONNECTION ESTABLISHED SUCCESSFULLY to MongoDB Atlas!");
    } catch (e) {
      console.error(`MongoDB: CRITICAL - FAILED TO ESTABLISH NEW CONNECTION to URI: ${safeUriToLog} for DB: ${dbName}`, e);
      throw e; // Re-throw to indicate failure to the caller
    }
  }
  
  // Ensure client is valid before proceeding
  if (!cached.client) {
    console.error("MongoDB: CRITICAL - cached.client is null after connection attempt. This indicates a severe connection issue not properly handled.");
    throw new Error("MongoDB: Failed to obtain a valid client connection.");
  }
  
  db = cached.client.db(dbName);
  cached.db = db;
  console.log(`MongoDB: Successfully using database: ${dbName}`);

  return { client: cached.client, db: cached.db };
}

export async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(collectionName);
}
