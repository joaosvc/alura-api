import express from "express";
import { config } from "dotenv";

const main = async () => {
  config();

  const server = {
    app: express(),
    port: process.env.SERVER_PORT || 8000,
  };

  server.app.listen(server.port, () =>
    console.log(`listening on port ${server.port}!`)
  );
};

main();
