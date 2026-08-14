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
    if (data.tool_calls) {
      for (const tc of data.tool_calls) {
        if (tc.name === 'write_to_file' && tc.args.TargetFile && tc.args.TargetFile.includes('implementation_plan.md')) {
          console.log(`Step ${data.step_index} (${data.created_at}) modified implementation_plan.md`);
        }
      }
    }
    if (data.type === 'USER_INPUT' && data.content.includes('media__')) {
      console.log(`Step ${data.step_index} (${data.created_at}) USER INPUT contains media__`);
      console.log(data.content);
    }
  } catch (e) {}
});
