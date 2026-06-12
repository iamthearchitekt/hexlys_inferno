const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\archi\\.gemini\\antigravity\\brain\\66c7c09e-41be-43ad-9516-b8a09e16285c\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let found = [];

  for await (const line of rl) {
    try {
        const obj = JSON.parse(line);
        if (obj.type === 'PLANNER_RESPONSE' && obj.tool_calls) {
            for (const call of obj.tool_calls) {
                if (call.name === 'write_to_file' && call.args && call.args.TargetFile) {
                    if (call.args.TargetFile.endsWith('levels.js"') || call.args.TargetFile.endsWith('levels.js')) {
                        if (call.args.CodeContent && call.args.CodeContent.includes('The Black Gale') && !call.args.CodeContent.includes('function createEmptyGrid')) {
                            found.push(call.args.CodeContent);
                        }
                    }
                }
            }
        }
    } catch (e) {}
  }
  
  if (found.length > 0) {
      console.log("Found it! " + found.length + " times.");
      // Take the most recent one (but before my recent overwrites, wait, I never wrote "The Black Gale" explicitly in levels.js using write_to_file except for my script, which is filtered out).
      fs.writeFileSync('levels_extracted.js', found[0].replace(/\\n/g, '\n').replace(/\\"/g, '"'));
  } else {
      console.log("Not found.");
  }
}

processLineByLine();
