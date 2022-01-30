import axios from "axios";
import fs from "fs";
import path from "path";
import { Contract } from "ethers";
import { namehash } from "ethers/lib/utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import { WrappersConfig } from "../config/WrappersConfig";
import { EnsConfig } from "../config/EnsConfig";
import { ConnectionService } from "./ConnectionService";
const contentHash = require("content-hash");
const ENS = require("@ensdomains/ensjs");

const FormData = require('form-data');

interface IDependencies {
  wrappersConfig: WrappersConfig;
  ensConfig: EnsConfig;
  connectionService: ConnectionService;
}

export class WrapperService {
  deps: IDependencies;

  constructor(deps: IDependencies) {
    this.deps = deps;
  }

  async addWrapper({ onlyHash, buildPath }: { onlyHash: boolean, buildPath: string }): Promise<string | undefined> {
    console.log(`Publishing build contents to IPFS...`);
    
    let resolvedPath = path.resolve(buildPath);
    if(!this.isValidWrapDir(resolvedPath)) {
      console.error("Could not find the build directory");
      return;
    }

    if(this.isValidWrapDir(path.join(resolvedPath, "build"))) {
      resolvedPath = path.join(resolvedPath, "build");
    }

    const data = new FormData();

    const files = fs.readdirSync(resolvedPath);
    console.log(`Found build directory at ${resolvedPath}`);

    for(const file of files) {
      console.log(`Adding ${file}`);

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
      const cid = resp.data.cid;

      console.log(`Publish to IPFS successful, CID: ${cid}`);
      return cid;
    } else if(resp.status === 200 && resp.data.error) {
      console.error(resp.data.error);
    } else {
      console.error("Unexpected error: " + resp.status);
    }

    return undefined;
  }

  async publishToEns(networkName: string, domain: string, cid: string) {
    console.log(`Publishing ${cid} to ${domain}...`);

    const signer = await this.deps.connectionService.getSigner(networkName);

    const provider = signer.provider as JsonRpcProvider;
    const network = await provider.getNetwork();

    const ens = new ENS.default({ provider: signer.provider, ensAddress: ENS.getEnsAddress(network.chainId) });

    const ensName = ens.name(domain);
    const resolver = await ensName.getResolver();

    const contract = new Contract(resolver, this.deps.ensConfig.ResolverAbi, signer);

    const hash: string =  "0x" + contentHash.fromIpfs(cid);
    
    console.log(`Setting contenthash for ${domain}`);

    const tx = await contract.setContenthash(namehash(domain), hash);

    console.log("Waiting for transaction: " + tx.hash);

    await tx.wait();

    console.log(`Publish successful!`);

    return undefined;
  }

  private isValidWrapDir(buildPath: string): boolean {
    return fs.existsSync(path.join(buildPath, "web3api.yaml"))
      || fs.existsSync(path.join(buildPath, "web3api.yml"));
  }
}