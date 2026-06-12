const fs = require('fs');
const lines = fs.readFileSync('C:\\Users\\archi\\.gemini\\antigravity\\brain\\66c7c09e-41be-43ad-9516-b8a09e16285c\\.system_generated\\logs\\transcript.jsonl', 'utf8').split('\n');
const targetLine = lines[10027];
const json = JSON.parse(targetLine);
const content = json.content;
const match = content.match(/\[\[.*\]\]/s);
if (match) {
    fs.writeFileSync('new_layout.json', match[0], 'utf8');
    console.log("Recovered successfully!");
} else {
    console.log("Failed to find JSON in content");
}
