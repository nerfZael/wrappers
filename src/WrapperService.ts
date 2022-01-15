import { WrappersConfig } from "./config/WrappersConfig";
import axios from "axios";
import fs from "fs";
import path from "path";
const FormData = require('form-data');

interface IDependencies {
  wrappersConfig: WrappersConfig;
}

export class WrapperService {
  deps: IDependencies;

  constructor(deps: IDependencies) {
    this.deps = deps;
  }

  async addWrapper({ onlyHash, buildPath }: { onlyHash: boolean, buildPath: string }) {
    let resolvedPath = path.resolve(buildPath);
    if(!this.isValidWrapDir(resolvedPath)) {
      console.error("Could not find the build directory");
      return;
    }

    if(this.isValidWrapDir(path.join(resolvedPath, "build"))) {
      resolvedPath = path.join(resolvedPath, "build");
    }

    console.log("resolverd", resolvedPath);

    const data = new FormData();

    const files = fs.readdirSync(resolvedPath);
    console.log(resolvedPath);

    for(const file of files) {
      console.log(file);

      const filePath = path.join(resolvedPath, file);

      const buffer = fs.readFileSync(filePath);
      data.append('files', buffer, { filename: file });
    }

    data.append('options', JSON.stringify({
      onlyHash: onlyHash
    }));

    const resp = await axios.post(this.deps.wrappersConfig.gatewayURI + "/add", data, {
      headers: {
        ...data.getHeaders(),
      }
    });

    if(resp.status === 200 && !resp.data.error) {
      console.log(resp.data);
    } else if(resp.status === 200 && resp.data.error) {
      console.error(resp.data.error);
    } else {
      console.error("Unexpected error: " + resp.status);
    }
  }

  private isValidWrapDir(buildPath: string): boolean {
    return fs.existsSync(path.join(buildPath, "web3api.yaml"))
      || fs.existsSync(path.join(buildPath, "web3api.yml"));
  }
}