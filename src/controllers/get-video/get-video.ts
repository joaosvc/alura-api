import axios from "axios";
import express from "express";
import { DatabaseClient } from "../../database/client";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetVideoParams } from "./protocols";

export class GetVideoController implements IController {
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

      const videoResponse = await DatabaseClient.getVideoWhere(
        courseId,
        module,
        video
      );

      const attachmentProxyId = decodeURIComponent(videoResponse.playlist);
      const attachmentUrl = `https://cdn.discordapp.com/attachments/${attachmentProxyId}`;

      const axiosResponse = await axios.get(attachmentUrl);

      if (axiosResponse && axiosResponse.data) {
        const baseURL = `https://${request.get("host")}`;
        const playlist = axiosResponse.data.replace(
          /ProxyId=/g,
          `${baseURL}/segment/`
        );

        response.setHeader("Content-Type", "application/vnd.apple.mpegurl");
        response.setHeader(
          "Content-Disposition",
          `attachment; filename=${courseId}-${module}-${video}.m3u8`
        );
        //response.setHeader("Cache-Control", "public, max-age=3600");

        return ok<string>(playlist);
      } else {
        return serverError("Failed to retrieve valid response");
      }
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
