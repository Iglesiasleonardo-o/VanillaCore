import { MongoClient } from 'mongodb';

const URI = "mongodb://127.0.0.1:27017/vanillacore" || process.env.DB_URI;
export const client = new MongoClient(URI);
await connectToDatabase();
const database = client.db();

// export const stats = database.collection('stats');
export const users = database.collection('users');
// define all collections here and export them, so we have a single source of truth for the database structure

async function connectToDatabase() {
    try {
        console.log('Connecting to', URI);
        await client.connect();
        console.log('Successfully connected to MongoDB!');
    } catch (error) {
        console.error('Connection to MongoDB failed!');
        await client.close();
        throw error;
    }
}
