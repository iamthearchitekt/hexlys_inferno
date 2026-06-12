const fs = require('fs');
const content = fs.readFileSync('scratch/all_game_edits.txt', 'utf8');
const steps = content.split('================================================================================');

const targetSteps = [2234, 2249, 2255, 2258, 2267];

targetSteps.forEach(num => {
    const step = steps.find(s => s.includes(`STEP ${num}:`) || s.includes(`STEP ${num}\n`));
    if (step) {
        console.log(`\n================================================================================`);
        console.log(`STEP ${num}`);
        console.log(`================================================================================`);
        console.log(step.trim());
    } else {
        console.log(`Step ${num} not found`);
    }
});
