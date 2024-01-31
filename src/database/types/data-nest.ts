import NestExplorer from "../client/nest-explorer";

export const DataNest = {
  client: undefined as unknown as NestExplorer,

  async connect(): Promise<void> {
    try {
      this.client = new NestExplorer();

      console.log("Connected to DataNest");
    } catch (error) {
      console.error("Error connecting to DataNest");
      console.error(error);
    }
  },
};
