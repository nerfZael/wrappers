export class EthersConfig {
  providerNetwork = process.env.ETHEREUM_NETWORK_PROVIDER ?? "http://localhost:8545";
  privateKey = process.env.ETHEREUM_PRIVATE_KEY ?? "";
}
