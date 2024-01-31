import express from "express";
import cors from "cors";
import { Router } from "express";
import { GetCoursesController } from "../controllers/get-courses/get-courses";
import { GetModulesController } from "../controllers/get-modules/get-modules";
import { GetVideosController } from "../controllers/get-videos/get-videos";

const serverRouter = Router();

serverRouter.get("/courses", cors(), express.json(), async (req, res) => {
  const getCoursesController = new GetCoursesController();

  const { body, statusCode } = await getCoursesController.handle();

  res.status(statusCode).send(body);
});

serverRouter.get("/modules", express.json(), async (req, res) => {
  const getModulesController = new GetModulesController();

  const { body, statusCode } = await getModulesController.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
});

serverRouter.get("/videos", express.json(), async (req, res) => {
  const getVideosController = new GetVideosController();

  const { body, statusCode } = await getVideosController.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
});

export default serverRouter;
