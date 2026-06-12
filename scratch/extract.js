const fs = require('fs');
const readline = require('readline');

async function extract() {
    const fileStream = fs.createReadStream('C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let bestCode = '';

    for await (const line of rl) {
        try {
            const entry = JSON.parse(line);
            if (entry.tool_calls) {
                for (let tc of entry.tool_calls) {
                    if (tc.function && tc.function.name === 'write_to_file' || tc.function && tc.function.name === 'multi_replace_file_content' || tc.function && tc.function.name === 'replace_file_content') {
                        // wait, the transcript doesn't store the FULL file after replacement!
                        // it only stores the tool arguments (ReplacementChunks).
                        // but wait! `view_file` might store the full file? No, view_file returns snippets.
                    }
                }
            }
        } catch (e) {}
    }
}
extract();
