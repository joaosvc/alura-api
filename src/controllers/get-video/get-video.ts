import { DatabaseClient } from "../../database/client";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetVideoParams } from "./protocols";
import { Video } from "../../models/course/video";

export class GetVideoController implements IController {
  async handle(
    httpRequest: HttpRequest<GetVideoParams>
  ): Promise<HttpResponse<Video | string>> {
    try {
      const courseId = httpRequest?.params?.courseId;
      const module = httpRequest?.params?.module;
      const video = httpRequest?.params?.video;

      if (!courseId) {
        return badRequest("Missing course id");
      }

      if (!module) {
        return badRequest("Missing module");
      }

      if (!video) {
        return badRequest("Missing video");
      }

      const { name, url } = await DatabaseClient.getVideoWhere(
        courseId,
        module,
        video
      );

      return ok<Video>({
        name,
        url
      });
    } catch (error) {
      if (error instanceof Error) {
        return badRequest(error.message);
      } else {
        console.error(error);
        return serverError();
      }
    }
  }
}
