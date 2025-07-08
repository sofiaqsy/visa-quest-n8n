const { spawn } = require('child_process');

// Set the PORT environment variable for n8n
process.env.N8N_PORT = process.env.PORT || 5678;

console.log(`Starting n8n on port ${process.env.N8N_PORT}...`);

// Start n8n
const n8n = spawn('n8n', ['start'], {
  stdio: 'inherit',
  env: process.env
});

n8n.on('error', (error) => {
  console.error('Failed to start n8n:', error);
  process.exit(1);
});

n8n.on('exit', (code) => {
  console.log(`n8n exited with code ${code}`);
  process.exit(code);
});
