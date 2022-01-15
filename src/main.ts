#!/usr/bin/env node
import { buildDependencyContainer } from "./di/buildDependencyContainer";
import { program } from "commander";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env("");

(async () => {
  const dependencyContainer = await buildDependencyContainer();
  const {
    fileService,
  } = dependencyContainer.cradle;


  program
    .command("add")
    .description("Publish the wrapper to the wrap gateway")
    .action(async (options) => {
      await fileService.addWrapper();
    });

  program.parse(process.argv);
})();
