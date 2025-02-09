const fs = require('fs');
const path = require('path');

// Read the mainnet config file
const chain = process.argv[2];
console.log("Bumping version for chain:", chain);
const configPath = path.join(__dirname, '..', 'config', `${chain}.json`);
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Bump the version
const currentVersion = config.version || '0.0.0';
const [major, minor, patch] = currentVersion.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

// Update the version in the config
config.version = newVersion;

// Write the updated config back to file
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log(`Version bumped from ${currentVersion} to ${newVersion}`);