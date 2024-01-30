import NestExplorer from "./client/nest-explorer";

export const DataNest = {
  client: undefined as unknown as NestExplorer,

  async connect(): Promise<void> {
    this.client = new NestExplorer();

    console.log("connected to data-nest!");
  },
};
