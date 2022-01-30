import { Wallet } from "ethers";

export type Connection = {
  provider: string;
  wallet: Wallet;
}
