const https = require('https');

https.get('https://github-contributions-api.deno.dev/Eshwar187.json', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Keys of top-level JSON:', Object.keys(parsed));
      if (parsed.contributions) {
        console.log('contributions type:', Array.isArray(parsed.contributions) ? 'array' : typeof parsed.contributions);
        console.log('length:', parsed.contributions.length);
        console.log('Sample contribution week 0:', JSON.stringify(parsed.contributions[0]));
      }
      if (parsed.total) {
        console.log('Total contributions:', parsed.total);
      }
    } catch (e) {
      console.error('Failed to parse:', e.message);
      console.log('Data sample:', data.slice(0, 500));
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
