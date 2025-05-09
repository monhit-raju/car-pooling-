// Test using MongoDB native driver
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000
});

async function run() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected successfully to MongoDB Atlas!');
    
    // List databases to verify connection
    const adminDb = client.db('admin');
    const result = await adminDb.command({ listDatabases: 1 });
    console.log('Available databases:');
    result.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

run();