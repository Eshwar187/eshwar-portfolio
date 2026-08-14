const https = require('https');

const options = {
  hostname: 'api.github.com',
  path: '/users/Eshwar187/repos?sort=updated&per_page=10',
  headers: {
    'User-Agent': 'Node.js-App'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const repos = JSON.parse(data);
      console.log('Top 10 updated repositories:');
      repos.forEach(repo => {
        console.log(`- ${repo.name}: ${repo.description} (${repo.html_url}) - Lang: ${repo.language}, Stars: ${repo.stargazers_count}`);
      });
    } catch (e) {
      console.error('Failed to parse:', e.message);
      console.log('Data sample:', data.slice(0, 500));
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
