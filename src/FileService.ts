import { WrappersConfig } from "./config/WrappersConfig";

interface IDependencies {
  wrappersConfig: WrappersConfig;
}

export class FileService {
  deps: IDependencies;

  constructor(deps: IDependencies) {
    this.deps = deps;
  }

  async addWrapper() {
    console.log("Hello Turtle!");
  }
}