// Test direct connection to a MongoDB Atlas shard using IP address
require('dotenv').config();
const { MongoClient } = require('mongodb');

// Use the IP addresses we found from DNS resolution
const shardIPs = [
  '159.41.178.60',  // ac-qwq2ou4-shard-00-00
  '159.41.178.73',  // ac-qwq2ou4-shard-00-01
  '159.41.178.86'   // ac-qwq2ou4-shard-00-02
];

const username = 'monhitrajul';
const password = 'g3IvfGPjhKj02Cbo';
const port = 27017;

async function testDirectConnection() {
  for (const ip of shardIPs) {
    // Create a direct connection string to the IP
    const directUri = `mongodb://${username}:${password}@${ip}:${port}/admin?ssl=true&authSource=admin&replicaSet=atlas-j9r21n-shard-0`;
    
    console.log(`Testing connection to ${ip}:${port}...`);
    
    const client = new MongoClient(directUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    try {
      await client.connect();
      console.log(`✅ Successfully connected to ${ip}:${port}!`);
      await client.close();
      return; // Exit after first successful connection
    } catch (err) {
      console.error(`❌ Failed to connect to ${ip}:${port}:`, err.message);
    }
  }
  
  console.log('\nAll connection attempts failed.');
}

testDirectConnection();