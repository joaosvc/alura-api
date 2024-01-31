import { DatabaseClient } from "../../database/client";
import { Video } from "../../models/video";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetVideosParams } from "./protocols";

export class GetVideosController implements IController {
  async handle(
    httpRequest: HttpRequest<GetVideosParams>
  ): Promise<HttpResponse<Video[] | string>> {
    try {
      const courseId = httpRequest?.params?.courseId;
      const module = httpRequest?.params?.module;

      if (!courseId) {
        return badRequest("Missing course id");
      }

      if (!module) {
        return badRequest("Missing module");
      }
      const videos = await DatabaseClient.getVideosWhere(courseId, module);

      return ok<Video[]>(videos);
    } catch (error) {
      return serverError();
    }
  }
}
