import { DatabaseClient } from "../../database/client";
import { Video } from "../../models/course/video";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetVideosParams } from "./protocols";

export class GetVideosController implements IController {
  async handle(
    httpRequest: HttpRequest<GetVideosParams>
  ): Promise<HttpResponse<Video[] | string>> {
    try {
      const requiredFields: (keyof GetVideosParams)[] = ["courseId", "module"];

      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof GetVideosParams]?.length) {
          return badRequest(`Field ${field} is required`);
        }
      }

      const videos = await DatabaseClient.getVideosWhere(
        httpRequest.body!.courseId,
        httpRequest.body!.module
      );

      return ok<Video[]>(videos);
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
