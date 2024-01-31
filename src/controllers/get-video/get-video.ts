import axios from "axios";
import express from "express";
import { DatabaseClient } from "../../database/client";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetVideoParams } from "./protocols";

export class GetVideoController implements IController {
  async handle(
    httpRequest: HttpRequest<GetVideoParams>,
    request: express.Request
  ): Promise<HttpResponse<string>> {
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

      const video = await DatabaseClient.getVideoWhere(
        httpRequest.body!.courseId,
        httpRequest.body!.module,
        httpRequest.body!.video
      );

      const attachmentProxyId = decodeURIComponent(video.playlistId);
      const attachmentUrl = `https://cdn.discordapp.com/attachments/${attachmentProxyId}`;

      const axiosResponse = await axios.get(attachmentUrl);

      if (axiosResponse && axiosResponse.data) {
        const baseURL = `${request.protocol}://${request.get("host")}`;
        const playlist = axiosResponse.data.replace(
          /ProxyId=/g,
          `${baseURL}/segment/`
        );

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
