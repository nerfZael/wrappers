import fs from "fs";
import path from "path";

export const isValidWrapDir = (buildPath: string): boolean => {
  return fs.existsSync(path.join(buildPath, "web3api.yaml"))
    || fs.existsSync(path.join(buildPath, "web3api.yml"))
    || fs.existsSync(path.join(buildPath, "web3api.json"));
};