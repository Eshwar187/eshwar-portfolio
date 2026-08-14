const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\eshwar\\.gemini\\antigravity\\brain\\18469bc9-e420-418c-9db5-3904cfbde7cd\\.system_generated\\logs\\transcript.jsonl';

const targets = {
  1433: 'c:/Users/eshwar/Desktop/pt/src/app/components/preloader/preloader.ts',
  1429: 'c:/Users/eshwar/Desktop/pt/src/app/components/preloader/preloader.html',
  1431: 'c:/Users/eshwar/Desktop/pt/src/app/components/preloader/preloader.css'
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
      let code = tc.args.CodeContent;
      
      while (typeof code === 'string' && code.trim().startsWith('"') && code.trim().endsWith('"')) {
        try {
          code = JSON.parse(code.trim());
        } catch (e) {
          break;
        }
      }
      fs.writeFileSync(targets[step], code, 'utf8');
      console.log(`Successfully restored step ${step} to ${targets[step]}`);
    }
  } catch (e) {
    // ignore
  }
});
