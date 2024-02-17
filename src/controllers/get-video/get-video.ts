import express from "express";
import { DatabaseClient } from "../../database/client";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetVideoParams } from "./protocols";
import { DropboxClient } from "../../dropbox/dropbox";

export class GetRawVideoController implements IController {
  async handle(
    httpRequest: HttpRequest<GetVideoParams>,
    request: express.Request,
    response: express.Response
  ): Promise<HttpResponse<string>> {
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

      const { name, path } = await DatabaseClient.getVideoWhere(
        courseId,
        module,
        video
      );

      const streamResponse = await DropboxClient.client.downloadAsStream(
        `/alura/${path}`
      );

      response.setHeader("Content-Type", "video/mp4");
      response.setHeader("Content-Length", streamResponse.fileSize.toString());
      response.setHeader("Cache-Control", "public, max-age=43200");

      response.setHeader(
        "Content-Disposition",
        `attachment; filename=${name}/${module}-${video}.mp4`
      );

      streamResponse.stream.pipe(response, { end: true });

      return ok<string>("Streaming in progress");
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
