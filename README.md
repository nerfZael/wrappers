# Wrappers

Wrappers is a command-line tool for publishing polywrappers to IPFS and ENS.
IPFS publishing is done via a wrap-persistence-node endpoint (https://www.npmjs.com/package/@nerfzael/wrap-persistence-node).
By default it publishes to the public https://ipfs.wrappers.io endpoint.

### Install and run:
1. Install with "npm install -g @nerfzael/wrappers"
3. In your wrapper directory (or the wrapper build directory) run "wrappers {command}"

#### Publish to IPFS:
```
wrappers ipfs
```

#### Set up an Ethereum connection:
```
wrappers connection -n rinkeby -p https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161 -pk <Your private key>
```
You will be asked for a password to use for the private key encryption.
You can choose to save the password to disk(-s option), so that you do not have to type it in every time you publish to ENS) 

#### Publish to ENS:
```
wrappers ens -d my-domain.eth -n rinkeby
```
You need to have an Ethereum connection set up for the network you are trying to publish to.
If you have chosen not to save the password to disk, the cli will ask you to type it in.

### The following commands are supported:
- ipfs:        Publish the wrapper to IPFS
- ens:         Publish the wrapper to ENS
- connection:  Set up an ethereum connection (provider and encrypted private key)
- help:  display help for command
