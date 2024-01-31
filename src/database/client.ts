import { ClientTypes, IDatabaseClient } from "./protocols";
import { DataNest } from "./types/data-nest";

export const Type = ClientTypes.DataNest;

export const DatabaseClient = {
  client: undefined as unknown as IDatabaseClient,

  async connect() {
    if (Type === ClientTypes.DataNest) {
      this.client = DataNest;
    }

    await this.client.connect();
  },
};
