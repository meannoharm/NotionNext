import { MongoClient } from 'mongodb';

const DB_URL = process.env.MONGO_DB_URL as string;
const DB_NAME = process.env.MONGO_DB_NAME as string;
const DB_COLLECTION = 'posts';

let client: MongoClient | null = null;

async function connectToDatabase() {
  if (!client) {
    client = await MongoClient.connect(DB_URL, {
      // Optional connection pooling config
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });
  }
  return client.db(DB_NAME);
}

export async function getCache(key: string) {
  try {
    const dbo = await connectToDatabase();
    const query = { block_id: key };
    const res = await dbo.collection(DB_COLLECTION).findOne(query);
    return res;
  } catch (err) {
    console.error(`Failed to get cache for key: ${key}`, err);
    throw err;
  }
}

export async function setCache(key: string, data: any) {
  try {
    const dbo = await connectToDatabase();
    data.block_id = key;
    const query = { block_id: key };
    const jsonObj = JSON.parse(JSON.stringify(data));

    const updRes = await dbo
      .collection(DB_COLLECTION)
      .updateOne(query, { $set: jsonObj });
    console.log('Update result', key, updRes);

    if (updRes.matchedCount === 0) {
      const insertRes = await dbo.collection(DB_COLLECTION).insertOne(jsonObj);
      console.log('Insert result', key, insertRes);
    }

    return data;
  } catch (err) {
    console.error(`Failed to set cache for key: ${key}`, err);
    throw err;
  }
}

export async function delCache(key: string) {
  try {
    const dbo = await connectToDatabase();
    const query = { block_id: key };
    const res = await dbo.collection(DB_COLLECTION).deleteOne(query);
    console.log('Delete result', key, res);
    return null;
  } catch (err) {
    console.error(`Failed to delete cache for key: ${key}`, err);
    throw err;
  }
}

const mongoDbCache = { getCache, setCache, delCache };

export default mongoDbCache;
