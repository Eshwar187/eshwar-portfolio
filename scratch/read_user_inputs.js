const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\eshwar\\.gemini\\antigravity\\brain\\18469bc9-e420-418c-9db5-3904cfbde7cd\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const data = JSON.parse(line);
    if (data.type === 'USER_INPUT') {
      console.log(`Step ${data.step_index} (${data.created_at}):`);
      console.log(data.content);
      console.log("-".repeat(40));
    }
  } catch (e) {}
});
