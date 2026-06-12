const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\archi\\.gemini\\antigravity\\brain\\66c7c09e-41be-43ad-9516-b8a09e16285c\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    try {
        const obj = JSON.parse(line);
        if (obj.type === 'PLANNER_RESPONSE' && obj.tool_calls) {
            for (const call of obj.tool_calls) {
                if (call.name === 'write_to_file' && call.args && call.args.TargetFile && call.args.TargetFile.endsWith('levels.js')) {
                    console.log(`[Step ${obj.step_index}] write_to_file levels.js. Length: ${call.args.CodeContent.length}`);
                    fs.writeFileSync(`levels_snapshot_${obj.step_index}.js`, call.args.CodeContent.replace(/\\n/g, '\n').replace(/\\"/g, '"'));
                }
                if (call.name === 'replace_file_content' && call.args && call.args.TargetFile && call.args.TargetFile.endsWith('levels.js')) {
                    console.log(`[Step ${obj.step_index}] replace_file_content levels.js. Length: ${call.args.ReplacementContent.length}`);
                }
            }
        }
    } catch (e) {}
  }
}

processLineByLine();
