const { execSync } = require('child_process');

try {
    console.log('Searching for "Inferno Gate" in HEAD...');
    const out1 = execSync('git grep "Inferno Gate" HEAD').toString();
    console.log(out1);
} catch (e) {
    console.log('Not found "Inferno Gate" in HEAD');
}

try {
    console.log('Searching for "LEVELS" in HEAD...');
    const out2 = execSync('git grep "LEVELS" HEAD').toString();
    console.log(out2.substring(0, 1000));
} catch (e) {
    console.log('Not found "LEVELS" in HEAD');
}
