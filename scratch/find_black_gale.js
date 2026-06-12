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
    if (line.includes('The Black Gale')) {
        console.log(`\n\n--- MATCH AT LINE ${lineNum} ---`);
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
             for (const call of obj.tool_calls) {
                  if (JSON.stringify(call).includes('The Black Gale')) {
                       console.log(`Tool call: ${call.name}`);
                       if (call.args && call.args.CodeContent) {
                            fs.writeFileSync(`black_gale_${lineNum}.js`, call.args.CodeContent);
                            console.log(`Wrote black_gale_${lineNum}.js`);
                       } else if (call.args && call.args.CommandLine) {
                            console.log(`Command Line: ${call.args.CommandLine}`);
                       } else {
                            console.log(`Other args: ${JSON.stringify(call.args).substring(0, 200)}...`);
                       }
                  }
             }
        } else {
            console.log(`Content match: ${obj.content ? obj.content.substring(0, 500) : ''}`);
        }
    }
  }
}

processLineByLine();
