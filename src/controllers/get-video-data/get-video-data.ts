import { DatabaseClient } from "../../database/client";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetVideoParams } from "./protocols";
import { Video } from "../../models/course/video";
import { Request } from "express";
import { DropboxClient } from "../../dropbox/dropbox";
import NodeCache from "node-cache";

const nodeCache = new NodeCache();
const URL_TYPE = "request_dropbox";

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

      const { name, path } = await DatabaseClient.getVideoWhere(
        courseId,
        module,
        video
      );

      const host = `https://${request.hostname}`;
      const extraData = httpRequest.body!.thumbnail === true && {
        thumbnail: `${process.env.THUMBNAILS_URL}/${courseId}/${module}/${video}.png`,
      };

      const cacheKey = `${courseId}_${module}_${video}`;
      let url = nodeCache.get(cacheKey) as string | null;

      if (!url) {
        if (URL_TYPE === "request_dropbox") {
          url = (await DropboxClient.client.getTemporaryLink(`/alura/${path}`))
            .link;
        } else {
          url = `${host}/course/raw-video/${courseId}/${module}/${video}`;
        }

        nodeCache.set(cacheKey, url, 60 * 60 * 3);
      }

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
