/**
 * @file env.js
 * @description Lightweight .env environment variable parser and loader.
 * Parses key-value pairs without external dependency requirements.
 */
const fs = require('fs');
const path = require('path');

/**
 * Reads and parses .env file from the backend directory and loads values into process.env.
 * Skips comments (#) and avoids overwriting existing environment variables.
 * @returns {void}
 */
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const splitIndex = trimmed.indexOf('=');
    if (splitIndex !== -1) {
      const key = trimmed.slice(0, splitIndex).trim();
      const value = trimmed.slice(splitIndex + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

module.exports = loadEnv;
