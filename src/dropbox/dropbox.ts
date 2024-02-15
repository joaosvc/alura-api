import DropboxClientType from "./client/dropbox-client";

export const DropboxClient = {
  client: undefined as unknown as DropboxClientType,

  async connect(): Promise<void> {
    try {
      this.client = new DropboxClientType({
        clientId: process.env.DBX_TO_CLIENT_KEY,
        clientSecret: process.env.DBX_TO_CLIENT_SECRET,
        refreshToken: process.env.DBX_TO_REFRESH_TOKEN,
      });

      console.log("Connecting to Dropbox...");
      await this.client.validateAccessToken();

      console.log("Connected to Dropbox");
    } catch (error) {
      console.error("Error connecting to Dropbox");
      console.error(error);
    }
  },
};
