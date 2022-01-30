import { EncryptedConnection } from "./EncryptedConnection";

export type ConnectionContainer = {
  [networkName: string]: EncryptedConnection;
}
