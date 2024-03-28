// Import the MongoClient class from the mongodb package
const { MongoClient } = require('mongodb');

// URL para a conexão com a DB
const url = 'mongodb+srv://ExploreBragaAdmin:Discord123@explorebraga.dy233rx.mongodb.net/?retryWrites=true&w=majority';

// Nome da BD
const dbName = 'ExploreBraga';


async function connect() {

    const client = new MongoClient(url);

    try {
        
        await client.connect();

        console.log("Connected to the MongoDB server");

        // Aceder à BD ExploreBraga
        const db = client.db(dbName);
		const col = db.collection('Users');
		const res = await col.find().toArray();
		console.log(res);

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        // Close the connection when done
        client.close();
        console.log("Connection closed");
    }
}

connect();