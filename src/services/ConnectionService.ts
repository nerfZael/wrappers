import path from "path";
import fs from "fs";
import { PasswordService } from "./PasswordService";
import { ethers, Signer, Wallet } from "ethers";
import { Connection } from "../types/Connection";
import { ConnectionContainer } from "../types/ConnectionContainer";
import { EncryptedConnection } from "../types/EncryptedConnection";

interface IDependencies {
  passwordService: PasswordService;
}

export class ConnectionService {
  deps: IDependencies;
  private get secretFilePath(): string {
    return path.join(__dirname, "./.secret");
  }

  constructor(deps: IDependencies) {
    this.deps = deps;
  }

  async getSigner(networkName: string): Promise<Signer> {
    const password = await this.deps.passwordService.getPassword();

    const connectionContainer = this.getConnectionContainer();
 
    if(connectionContainer[networkName] === undefined) {
      throw new Error(`No connection saved for network ${networkName}`);
    }

    let account = await this.decryptConnection(connectionContainer[networkName], password);

    const signer = account.wallet.connect(new ethers.providers.JsonRpcProvider(account.provider));

    return signer;
  }

  async saveConnectionForNetwork(networkName: string, provider: string, privateKey: string): Promise<void> {
    const password = await this.deps.passwordService.getPassword();
    
    const connectionContainer = this.getConnectionContainer();

    connectionContainer[networkName] = await this.encryptConnection(provider, privateKey, password);

    this.saveConnectionContainer(connectionContainer);
  }

  private getConnectionContainer(): ConnectionContainer {
    return fs.existsSync(this.secretFilePath) 
      ? JSON.parse(fs.readFileSync(this.secretFilePath, { encoding: "utf-8" })) 
      : {};
  }

  private saveConnectionContainer(connectionContainer: ConnectionContainer): void {
    fs.writeFileSync(this.secretFilePath, JSON.stringify(connectionContainer), { encoding: "utf-8" });
    console.log("Saved secret");
  }

  async decryptConnection(encryptedConnection: EncryptedConnection, password: string): Promise<Connection> {
    return {
      provider: encryptedConnection.provider,
      wallet: await ethers.Wallet.fromEncryptedJson(encryptedConnection.encryptedKey, password)
    } as Connection;
  }

  async encryptConnection(provider: string, privateKey: string, password: string): Promise<EncryptedConnection> {
    const encryptedKey = await new ethers.Wallet(privateKey).encrypt(password);

    return {
      provider,
      encryptedKey,
    } as EncryptedConnection;
  }
}


