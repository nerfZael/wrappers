import * as awilix from "awilix";
import { NameAndRegistrationPair } from "awilix";
import { ethers } from "ethers";
import { EnsConfig } from "../config/EnsConfig";
import { EthersConfig } from "../config/EthersConfig";
import { WrappersConfig } from "../config/WrappersConfig";
import { PasswordService } from "../services/PasswordService";
import { ConnectionService } from "../services/ConnectionService";
import { WrapperService } from "../services/WrapperService";

export const buildDependencyContainer = async(
  extensionsAndOverrides?: NameAndRegistrationPair<unknown>
): Promise<awilix.AwilixContainer<any>> => {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
  });

  container.register({
    wrappersConfig: awilix.asClass(WrappersConfig).singleton(),
    wrapperService: awilix.asClass(WrapperService).singleton(),
    ethersConfig: awilix.asClass(EthersConfig).singleton(),
    ensConfig: awilix.asClass(EnsConfig).singleton(),
    passwordService: awilix.asClass(PasswordService).singleton(),
    connectionService: awilix.asClass(ConnectionService).singleton(),
    ethersProvider: awilix
      .asFunction(({ ethersConfig }) => {
        return ethers.providers.getDefaultProvider(
          ethersConfig.providerNetwork
        );
      })
      .singleton(),
    ensPublicResolver: awilix
    .asFunction(({ ensConfig, ethersProvider }) => {
      const contract = new ethers.Contract(ensConfig.ResolverAddr, ensConfig.ResolverAbi, ethersProvider);
      
      return contract;
    }).singleton(),
    ...extensionsAndOverrides,
  });

  return container;
};
