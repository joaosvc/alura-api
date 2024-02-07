import express from "express";
import cors, { CorsOptions } from "cors";
import { Router } from "express";
import { GetCoursesController } from "../controllers/get-courses/get-courses";
import { GetModulesController } from "../controllers/get-modules/get-modules";
import { GetVideosController } from "../controllers/get-videos/get-videos";
import { authMiddleware } from "../middleware/middleware";
import { GetJwtTokenController } from "../controllers/get-token/get-token";
import { GetVideoController } from "../controllers/get-video/get-video";
import { GetVideoSegmentController } from "../controllers/get-segment/get-segment";
import { GetCategoriesController } from "../controllers/get-categories/get-categories";
import { GetCategoryModulesController } from "../controllers/get-category/get-category";
import { HttpStatusCode } from "../controllers/protocols";
import { GetCategoriesWithModulesController } from "../controllers/get-categories/get-categories-modules";
import { GetModulesWithVideosController } from "../controllers/get-modules/get-modules-videos";

const serverRouter: Router = Router();
const corsOptions: CorsOptions = {
  origin: "*",
  methods: "GET, POST",
  optionsSuccessStatus: 204,
};

serverRouter.use(
  [
    "/courses",
    "/videos",
    "/modules",
    "/modules/videos",
    "/categories",
    "/categories/modules",
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

serverRouter.get("/categories", async (req, res) => {
  const getCategoriesController = new GetCategoriesController();

  const { body, statusCode } = await getCategoriesController.handle();

  res.status(statusCode).send(body);
});

serverRouter.get("/categories/modules", async (req, res) => {
  const getCategoriesWithModulesController =
    new GetCategoriesWithModulesController();

  const { body, statusCode } =
    await getCategoriesWithModulesController.handle();

  res.status(statusCode).send(body);
});

serverRouter.post("/modules", async (req, res) => {
  const getModulesController = new GetModulesController();

  const { body, statusCode } = await getModulesController.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
});

serverRouter.post("/modules/videos", async (req, res) => {
  const getModulesWithVideosController = new GetModulesWithVideosController();

  const { body, statusCode } = await getModulesWithVideosController.handle({
    body: req.body,
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

serverRouter.post("/videos", async (req, res) => {
  const getVideosController = new GetVideosController();

  const { body, statusCode } = await getVideosController.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
});

serverRouter.get("/jwt-token", express.json(), async (req, res) => {
  const getJwtTokenController = new GetJwtTokenController();

  const { body, statusCode } = await getJwtTokenController.handle();

  res.status(statusCode).send(body);
});

serverRouter.get("/video/:courseId/:module/:video/", async (req, res) => {
  const getVideoController = new GetVideoController();

  const { body, statusCode } = await getVideoController.handle(
    {
      body: req.body,
      params: req.params,
    },
    req,
    res
  );

  res.status(statusCode).send(body);
});

serverRouter.get("/segment/:id/", async (req, res) => {
  const getVideoSegmentController = new GetVideoSegmentController();

  const { body, statusCode } = await getVideoSegmentController.handle(
    {
      body: req.body,
      params: req.params,
    },
    req,
    res
  );

  if (statusCode !== HttpStatusCode.OK) {
    res.status(statusCode).send(body);
  }
});

export default serverRouter;
