#!/usr/bin/env node
import { buildDependencyContainer } from "./di/buildDependencyContainer";
import { program } from "commander";
import { WrapperService } from "./services/WrapperService";
import { PasswordService } from "./services/PasswordService";
import { ConnectionService } from "./services/ConnectionService";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env("");

(async () => {
  const dependencyContainer: {
    cradle: {
      wrapperService: WrapperService,
      passwordService: PasswordService,
      connectionService: ConnectionService,
    }
  } = await buildDependencyContainer();
  const {
    wrapperService,
    passwordService,
    connectionService,
  } = dependencyContainer.cradle;


  program
    .command("ipfs")
    .description("Publish the wrapper to the wrap gateway")
    .option("-p, --path", "Path to the build directory")
    .option("-o, --only-hash", "Only hash the wrapper")
    .action(async (options) => {
      //TODO: Check if the build contents are a valid wrapper
      await wrapperService.addWrapper({ 
        onlyHash: !!options.onlyHash,
        buildPath: options.path
          ? options.path
          : process.cwd()
      });
    });

  program
    .command("ens")
    .description("Publish the wrapper to the wrap gateway and ENS")
    .requiredOption("-d, --domain <string>", "ENS domain")
    .requiredOption("-n, --network <string>", "Network name")
    .option("-p, --path", "Path to the build directory")
    .option("-pwd, --password <string>", "Password to the Ethereum wallet")
    .action(async (options) => {
      const domain = options.domain;
     
      const cid: string | undefined = await wrapperService.addWrapper({ 
        onlyHash: false,
        buildPath: options.path
          ? options.path
          : process.cwd()
      });

      if(!cid) {
        return;
      }

      passwordService.setPassword(options.password);

      await wrapperService.publishToEns(options.network, domain, cid);
    });

  program
    .command("connection")
    .description("Set ethereum provider and key")
    .requiredOption("-n, --network <string>", "Network name")
    .requiredOption("-p, --provider <string>", "Provider URI")
    .requiredOption("-pk, --private-key <string>", "Private key")
    .option("-s, --save", "Save password to disk")
    .action(async (options) => {

      passwordService.clearPassword();

      await connectionService.saveConnectionForNetwork(options.network, options.provider, options.privateKey);

      if(options.save) {
        passwordService.savePassword();
      }
    });

  program.parse(process.argv);
})();
