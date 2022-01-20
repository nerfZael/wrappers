# Wrappers

Wrappers is a command-line tool for publishing polywrappers to IPFS via a wrap-persistence-node endpoint (https://www.npmjs.com/package/@nerfzael/wrap-persistence-node).
By default it publishes to the public https://ipfs.wrappers.io endpoint.

### Run without cloning the repo:
1. Install with "npm install -g @nerfzael/wrappers"
3. In your wrapper directory (or the wrapper build directory) run "wrappers {command}"

### Run with cloning the repo:
1. Clone the repo
2. Run "nvm install && nvm use"
3. Run "yarn" to install dependencies
5. Run "yarn dev {command}" to run the commands with ts-node

### The following commands are supported:
- add:   Publish the wrapper to the wrap gateway
- help:  display help for command