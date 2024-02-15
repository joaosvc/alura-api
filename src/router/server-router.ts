import express from "express";
import cors, { CorsOptions } from "cors";
import { Router } from "express";
import { GetCoursesController } from "../controllers/get-courses/get-courses";
import { GetModulesController } from "../controllers/get-modules/get-modules";
import { authMiddleware } from "../middleware/middleware";
import { GetJwtTokenController } from "../controllers/get-token/get-token";
import { GetVideoController } from "../controllers/get-video-data/get-video-data";
import { GetCategoriesController } from "../controllers/get-categories/get-categories";
import { GetCategoryModulesController } from "../controllers/get-category/get-category";

const serverRouter: Router = Router();
const corsOptions: CorsOptions = {
  origin: "*",
  methods: "GET, POST",
  optionsSuccessStatus: 204,
};

serverRouter.use(
  [
    "/courses",
    "/course/modules",
    "/course/video",
    "/categories",
    "/category/modules",
  ],
  cors(corsOptions),
  authMiddleware,
  express.json()
);

serverRouter.get("/courses", async (req, res) => {
  const getCoursesController = new GetCoursesController();

  const { body, statusCode } = await getCoursesController.handle();

  res.status(statusCode).send(body);
});

serverRouter.post("/categories", async (req, res) => {
  const getCategoriesController = new GetCategoriesController();

  const { body, statusCode } = await getCategoriesController.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
});

serverRouter.post("/course/modules", async (req, res) => {
  const getModulesController = new GetModulesController();

  const { body, statusCode } = await getModulesController.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
});

serverRouter.post("/course/video", async (req, res) => {
  const getVideoController = new GetVideoController();

  const { body, statusCode } = await getVideoController.handle({
    body: req.body,
    params: req.params,
  });

  res.status(statusCode).send(body);
});

serverRouter.post("/category/modules", async (req, res) => {
  const getCategoryModulesController = new GetCategoryModulesController();

  const { body, statusCode } = await getCategoryModulesController.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
});

serverRouter.get("/jwt-token", express.json(), async (req, res) => {
  const getJwtTokenController = new GetJwtTokenController();

  const { body, statusCode } = await getJwtTokenController.handle();

  res.status(statusCode).send(body);
});

export default serverRouter;
