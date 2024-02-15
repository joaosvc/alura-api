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
      const requiredFields: (keyof GetVideoParams)[] = [
        "courseId",
        "module",
        "video",
      ];

      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof GetVideoParams]?.length) {
          return badRequest(`Field ${field} is required`);
        }
      }

      const { name, url } = await DatabaseClient.getVideoWhere(
        httpRequest.body!.courseId,
        httpRequest.body!.module,
        httpRequest.body!.video
      );

      return ok<Video>({
        name,
        url,
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
