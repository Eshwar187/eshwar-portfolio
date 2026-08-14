const https = require('https');

const options = {
  hostname: 'api.github.com',
  path: '/users/Eshwar187',
  headers: {
    'User-Agent': 'Node.js-App'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Keys of user profile JSON:', Object.keys(parsed));
      console.log('Name:', parsed.name);
      console.log('Public repos:', parsed.public_repos);
      console.log('Followers:', parsed.followers);
      console.log('Bio:', parsed.bio);
    } catch (e) {
      console.error('Failed to parse:', e.message);
      console.log('Data sample:', data.slice(0, 500));
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
