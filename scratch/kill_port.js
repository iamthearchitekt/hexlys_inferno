const { execSync } = require('child_process');

try {
    console.log('Searching for process on port 3000...');
    const stdout = execSync('netstat -ano').toString();
    const lines = stdout.split('\n');
    let pidToKill = null;

    for (const line of lines) {
        if (line.includes(':3000') && line.includes('LISTENING')) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0') {
                pidToKill = pid;
                break;
            }
        }
    }

    if (pidToKill) {
        console.log(`Found process with PID ${pidToKill} listening on port 3000. Killing it...`);
        execSync(`taskkill /F /PID ${pidToKill}`);
        console.log('Successfully killed the process.');
    } else {
        console.log('No process found listening on port 3000.');
    }
} catch (e) {
    console.error('Error finding/killing process on port 3000:', e.message);
}
