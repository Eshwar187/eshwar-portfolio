const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\eshwar\\.gemini\\antigravity\\brain\\18469bc9-e420-418c-9db5-3904cfbde7cd\\.system_generated\\logs\\transcript.jsonl';

const targets = {
  1634: 'preloader.ts',
  1636: 'preloader.html',
  1638: 'preloader.css'
};

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const data = JSON.parse(line);
    const step = data.step_index;
    if (targets[step]) {
      console.log(`Step ${step} details:`);
      console.log(JSON.stringify(data.tool_calls[0].args, null, 2));
      console.log("=".repeat(80));
    }
  } catch (e) {}
});
