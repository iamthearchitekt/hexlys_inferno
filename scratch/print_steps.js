const fs = require('fs');
const content = fs.readFileSync('scratch/all_game_edits.txt', 'utf8');
const steps = content.split('================================================================================');

const targetSteps = [1919, 1226, 1234, 1577, 2035, 2153, 2168, 2187, 2449, 3115, 3118, 3127, 3163, 2538, 2589];

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
