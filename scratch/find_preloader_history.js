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
    const step = data.step_index;
    if (data.tool_calls && data.tool_calls.length > 0) {
      for (const tc of data.tool_calls) {
        if (tc.name === 'write_to_file' || tc.name === 'replace_file_content') {
          const target = tc.args.TargetFile || tc.args.TargetFile;
          if (target && target.includes('preloader')) {
            console.log(`Step ${step} (${data.created_at}): ${tc.name} -> ${target}`);
          }
        }
      }
    }
  } catch (e) {}
});
