const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\eshwar\\.gemini\\antigravity\\brain\\18469bc9-e420-418c-9db5-3904cfbde7cd\\.system_generated\\logs\\transcript.jsonl';

const targets = {
  1404: 'preloader.html.1404',
  1406: 'preloader.css.1406',
  1408: 'preloader.ts.1408'
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
      const tc = data.tool_calls[0];
      let code = tc.args.CodeContent.trim();
      if (code.startsWith('"') && code.endsWith('"')) {
        code = JSON.parse(code);
      }
      fs.writeFileSync('scratch/' + targets[step], code, 'utf8');
      console.log(`Saved step ${step} to scratch/${targets[step]}`);
    }
  } catch (e) {}
});
