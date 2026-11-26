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
