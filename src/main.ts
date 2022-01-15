#!/usr/bin/env node
import { buildDependencyContainer } from "./di/buildDependencyContainer";
import { program } from "commander";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env("");

(async () => {
  const dependencyContainer = await buildDependencyContainer();
  const {
    wrapperService,
  } = dependencyContainer.cradle;


  program
    .command("add")
    .description("Publish the wrapper to the wrap gateway")
    .option("-p, --path", "Path to the build directory")
    .option("-o, --only-hash", "Only hash the wrapper")
    .action(async (options) => {
      await wrapperService.addWrapper({ 
        onlyHash: !!options.onlyHash,
        buildPath: options.path
          ? options.path
          : process.cwd()
      });
    });

  program.parse(process.argv);
})();
