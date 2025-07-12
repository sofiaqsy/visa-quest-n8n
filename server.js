const { spawn } = require('child_process');

// Parse DATABASE_URL automatically if it exists
if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  
  // Configure environment variables for n8n
  process.env.DB_TYPE = 'postgresdb';
  process.env.DB_POSTGRESDB_HOST = url.hostname;
  process.env.DB_POSTGRESDB_PORT = url.port;
  process.env.DB_POSTGRESDB_DATABASE = url.pathname.substr(1);
  process.env.DB_POSTGRESDB_USER = url.username;
  process.env.DB_POSTGRESDB_PASSWORD = url.password;
  process.env.DB_POSTGRESDB_SSL_REJECT_UNAUTHORIZED = 'false';
  
  // For SSL on Heroku
  process.env.PGSSLMODE = 'no-verify';
  
  console.log('Database configuration loaded from DATABASE_URL');
  console.log(`Connecting to database: ${process.env.DB_POSTGRESDB_DATABASE} on ${process.env.DB_POSTGRESDB_HOST}`);
}

// Set the PORT environment variable for n8n
const port = process.env.PORT || 5678;
process.env.N8N_PORT = port;

// Additional n8n configurations
process.env.N8N_DEFAULT_BINARY_DATA_MODE = process.env.N8N_DEFAULT_BINARY_DATA_MODE || 'database';
process.env.N8N_PAYLOAD_SIZE_MAX = process.env.N8N_PAYLOAD_SIZE_MAX || '16';

console.log(`Starting n8n on port ${port}...`);

// Log important environment variables (without sensitive data)
console.log('Environment configuration:');
console.log(`- N8N_BASIC_AUTH_ACTIVE: ${process.env.N8N_BASIC_AUTH_ACTIVE}`);
console.log(`- N8N_BASIC_AUTH_USER: ${process.env.N8N_BASIC_AUTH_USER}`);
console.log(`- N8N_HOST: ${process.env.N8N_HOST}`);
console.log(`- N8N_PROTOCOL: ${process.env.N8N_PROTOCOL}`);
console.log(`- DB_TYPE: ${process.env.DB_TYPE}`);
console.log(`- Database Host: ${process.env.DB_POSTGRESDB_HOST}`);

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

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing n8n');
  n8n.kill();
  process.exit(0);
});