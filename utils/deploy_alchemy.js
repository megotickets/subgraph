const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Read the mainnet config to get the version
const chain = process.argv[2];
const configPath = path.join(__dirname, '..', 'config', `${chain}.json`);
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const version = config.version
if (!version) {
    console.error('Error: version not found in config');
    process.exit(1);
}

// Deployment configuration
const SUBGRAPH_NAME = `mego-tickets-${chain}`;
const ALCHEMY_DEPLOY_URL = 'https://subgraphs.alchemy.com/api/subgraphs/deploy';
const IPFS_URL = 'https://ipfs.satsuma.xyz';

// Read deploy key from environment variables
const DEPLOY_KEY = process.env.ALCHEMY_DEPLOY_KEY;

if (!DEPLOY_KEY) {
    console.error('Error: ALCHEMY_DEPLOY_KEY not found in environment variables');
    process.exit(1);
}

try {
    // Construct the deployment command
    const deployCommand = `graph deploy ${SUBGRAPH_NAME} \
        --version-label v${version} \
        --node ${ALCHEMY_DEPLOY_URL} \
        --deploy-key ${DEPLOY_KEY} \
        --ipfs ${IPFS_URL}`;

    // Execute the deployment
    console.log('Deploying subgraph to Alchemy...');
    execSync(deployCommand, { stdio: 'inherit' });

    console.log(`\nSubgraph deployed successfully with version v${version}`);
} catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
}
