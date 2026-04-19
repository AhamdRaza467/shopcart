const https = require('https');

https.get('https://dns.google/resolve?name=_mongodb._tcp.cluster0.wcobjpb.mongodb.net&type=SRV', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    if (json.Answer) {
      const nodes = json.Answer.map(ans => {
        // SRV format: priority weight port target
        const parts = ans.data.split(' ');
        const target = parts[3].endsWith('.') ? parts[3].slice(0, -1) : parts[3];
        const port = parts[2];
        return `${target}:${port}`;
      }).join(',');
      
      console.log('--- YOUR NEW BYPASS URL ---');
      console.log(`mongodb://shopcartuser:shopcart09ahmad@${nodes}/shopcart?ssl=true&replicaSet=atlas-13o6gq-shard-0&authSource=admin&retryWrites=true&w=majority`);
    } else {
      console.log('Failed to resolve via Google DNS.', json);
    }
  });
}).on('error', (e) => {
  console.error(e);
});
