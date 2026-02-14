import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const port = 3000;

// Example Connection String (You'll need a real one from MongoDB Atlas later)
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

app.get('/', (req, res) => {
    res.send('VanillaCore API is online with Express and MongoDB!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});