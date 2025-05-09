// Test basic connectivity to MongoDB Atlas servers
const dns = require('dns');
const { exec } = require('child_process');

console.log('Testing connectivity to MongoDB Atlas...');

// Extract hostname from connection string
require('dotenv').config();
const uri = process.env.MONGODB_URI;
const hostname = uri.match(/@([^\/]+)\//)[1];
console.log(`MongoDB Atlas hostname: ${hostname}`);

// Test DNS resolution
console.log('\nTesting DNS resolution...');
dns.resolve(hostname, (err, addresses) => {
  if (err) {
    console.error('❌ DNS resolution failed:', err);
  } else {
    console.log('✅ DNS resolution successful:', addresses);
    
    // Try to ping the servers
    console.log('\nTrying to ping MongoDB Atlas servers...');
    addresses.forEach(address => {
      exec(`ping -n 3 ${address}`, (error, stdout, stderr) => {
        console.log(`\nPing results for ${address}:`);
        if (error) {
          console.log(`❌ Ping failed: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`❌ Ping error: ${stderr}`);
          return;
        }
        console.log(stdout);
      });
    });
  }
});

// Test specific MongoDB Atlas hostnames
const atlasHosts = [
  'ac-qwq2ou4-shard-00-00.sfuj7n1.mongodb.net',
  'ac-qwq2ou4-shard-00-01.sfuj7n1.mongodb.net',
  'ac-qwq2ou4-shard-00-02.sfuj7n1.mongodb.net'
];

console.log('\nTesting individual MongoDB Atlas shard hostnames...');
atlasHosts.forEach(host => {
  dns.resolve(host, (err, addresses) => {
    if (err) {
      console.error(`❌ DNS resolution failed for ${host}:`, err);
    } else {
      console.log(`✅ DNS resolution successful for ${host}:`, addresses);
    }
  });
});