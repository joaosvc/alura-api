import express from "express";
import cors, { CorsOptions } from "cors";
import { config } from "dotenv";

const main = async () => {
  config();

  const server = {
    app: express(),
    port: process.env.SERVER_PORT || 8000,
  };

  const corsOptions: CorsOptions = {
    origin: "*",
    methods: "GET",
    optionsSuccessStatus: 204,
  };

  server.app.use(
    "/thumbnails",
    cors(corsOptions),
    express.static("thumbnails")
  );

  server.app.listen(server.port, async () =>
    console.log(`listening on port ${server.port}!`)
  );
};

main();
