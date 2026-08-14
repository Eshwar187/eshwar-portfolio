const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\eshwar\\.gemini\\antigravity\\brain\\18469bc9-e420-418c-9db5-3904cfbde7cd\\.system_generated\\logs\\transcript.jsonl';
const targetStep = parseInt(process.argv[2]);

if (!targetStep) {
  console.log("Please specify a step number.");
  process.exit(1);
}

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const data = JSON.parse(line);
    if (data.step_index === targetStep) {
      console.log(JSON.stringify(data, null, 2));
      process.exit(0);
    }
  } catch (e) {}
});
