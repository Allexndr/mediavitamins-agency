import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "mediavitamins";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(new Error("MONGODB_URI is not configured"));
  }

  const client = new MongoClient(uri);

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  return client.connect();
}

const clientPromise = uri ? createClientPromise() : null;

export async function getDb(): Promise<Db> {
  if (!clientPromise) {
    throw new Error("MONGODB_URI is not configured");
  }
  const client = await clientPromise;
  return client.db(dbName);
}

export function isMongoConfigured(): boolean {
  return Boolean(uri);
}
