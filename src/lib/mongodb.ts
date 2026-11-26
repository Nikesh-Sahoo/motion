import { MongoClient, Db, Collection, Document } from 'mongodb';

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // Allow global caching in development to prevent multiple connection pools during HMR
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoUri(): string {
  return process.env.MONGODB_URI || '';
}

/**
 * Checks whether MONGODB_URI is provided and configured with a real value
 */
export function isMongoConfigured(): boolean {
  const uri = getMongoUri();
  if (!uri || uri.trim().length === 0) return false;
  // If the placeholder has not been replaced yet
  if (uri.includes('<username>') || uri.includes('<password>')) return false;
  return true;
}

/**
 * Returns a cached Promise resolving to the connected MongoClient
 */
export async function getMongoClient(): Promise<MongoClient> {
  if (!isMongoConfigured()) {
    throw new Error(
      'MONGODB_URI is not configured. Please set a valid MongoDB connection string in .env.local.'
    );
  }

  const uri = getMongoUri();

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

/**
 * Returns the target MongoDB database instance
 */
export async function getDatabase(dbName?: string): Promise<Db> {
  const client = await getMongoClient();
  const targetDb = dbName || process.env.MONGODB_DB_NAME || 'motion';
  return client.db(targetDb);
}

/**
 * Returns a strongly-typed MongoDB Collection
 */
export async function getCollection<T extends Document = Document>(
  collectionName: string,
  dbName?: string
): Promise<Collection<T>> {
  const db = await getDatabase(dbName);
  return db.collection<T>(collectionName);
}

/**
 * Executes a MongoDB database operation safely in both local dev and Cloudflare Workers.
 * In production/Workers, creates and closes the MongoClient per request to satisfy Worker I/O isolation.
 */
export async function withDatabase<R = unknown>(
  operation: (db: Db) => Promise<R>,
  dbName?: string
): Promise<R> {
  if (!isMongoConfigured()) {
    throw new Error(
      'MONGODB_URI is not configured. Please set a valid MongoDB connection string in .env.local or Worker secrets.'
    );
  }

  const uri = getMongoUri();
  const targetDb = dbName || process.env.MONGODB_DB_NAME || 'motion';

  if (process.env.NODE_ENV === 'development') {
    const devClient = await getMongoClient();
    return operation(devClient.db(targetDb));
  }

  const reqClient = new MongoClient(uri, options);
  try {
    await reqClient.connect();
    return await operation(reqClient.db(targetDb));
  } finally {
    await reqClient.close().catch(() => {});
  }
}

/**
 * Executes a MongoDB collection operation safely in both local dev and Cloudflare Workers.
 * In production/Workers, creates and closes the MongoClient per request to satisfy Worker I/O isolation.
 */
export async function withCollection<T extends Document = Document, R = unknown>(
  collectionName: string,
  operation: (collection: Collection<T>) => Promise<R>,
  dbName?: string
): Promise<R> {
  return withDatabase(
    (db) => operation(db.collection<T>(collectionName)),
    dbName
  );
}
