import { config } from "dotenv";
import { DatabaseClient } from "./database/client";
import express from "express";

const main = async () => {
  config();

  const server = {
    app: express(),
    port: process.env.SERVER_PORT || 8000,
  };

  await DatabaseClient.connect();

  server.app.listen(server.port, () =>
    console.log(`listening on port ${server.port}!`)
  );
};

main();
