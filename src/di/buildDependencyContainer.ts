import * as awilix from "awilix";
import { NameAndRegistrationPair } from "awilix";
import { WrappersConfig } from "../config/WrappersConfig";
import { WrapperService } from "../WrapperService";

export const buildDependencyContainer = async(
  extensionsAndOverrides?: NameAndRegistrationPair<unknown>
): Promise<awilix.AwilixContainer<any>> => {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
  });

  container.register({
    wrappersConfig: awilix.asClass(WrappersConfig).singleton(),
    wrapperService: awilix.asClass(WrapperService).singleton(),
    ...extensionsAndOverrides,
  });

  return container;
};
