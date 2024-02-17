import { DatabaseClient } from "../../database/client";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetVideoParams } from "./protocols";
import { Video } from "../../models/course/video";
import { Request } from "express";

export class GetVideoController implements IController {
  async handle(
    httpRequest: HttpRequest<GetVideoParams>,
    request: Request
  ): Promise<HttpResponse<Video | string>> {
    try {
      const requiredFields: (keyof GetVideoParams)[] = [
        "courseId",
        "module",
        "video",
      ];

      for (const field of requiredFields) {
        const value = httpRequest?.body?.[field as keyof GetVideoParams];

        if (typeof value === "string" && !value.length) {
          return badRequest(`Field ${field} is required`);
        }
      }

      const { courseId, module, video } = httpRequest.body!;

      const { name, url } = await DatabaseClient.getVideoWhere(
        courseId,
        module,
        video
      );

      const extraData = httpRequest.body!.thumbnail === true && {
        thumbnail: `https://${request.hostname}/thumbnails/${courseId}/${module}/${video}.png`,
      };

      return ok<Video>({
        name,
        url: url!,
        ...extraData,
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
