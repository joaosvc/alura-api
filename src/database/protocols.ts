import NestExplorer from "./client/nest-explorer";

export interface IDatabaseClient {
  client: NestExplorer;
  connect(): Promise<void>;
}

export const ClientTypes = {
  DataNest: Symbol.for("DataNest"),
};
