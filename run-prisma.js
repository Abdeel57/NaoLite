const { exec } = require('child_process');
const fs = require('fs');

exec('npx prisma db push', (error, stdout, stderr) => {
    const output = `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}\n\nERROR:\n${error ? error.message : ''}`;
    fs.writeFileSync('prisma-output.txt', output);
    console.log('Done');
});
