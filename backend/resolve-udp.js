const dns = require('dns');

// Force Node.js to use Google's Public DNS (8.8.8.8) instead of the router's DNS!
dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv('_mongodb._tcp.cluster0.wcobjpb.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('Even Google DNS failed:', err);
  } else {
    console.log('--- SUCCESS! HERE IS YOUR BYPASS STRING ---');
    const nodes = addresses.map(a => `${a.name}:${a.port}`).join(',');
    console.log(`mongodb://shopcartuser:shopcart09ahmad@${nodes}/shopcart?ssl=true&replicaSet=atlas-wcobjpb-shard-0&authSource=admin&retryWrites=true&w=majority`);
  }
});
