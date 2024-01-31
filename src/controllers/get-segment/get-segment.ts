import axios from "axios";
import express from "express";
import { Readable } from "stream";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";

export class GetVideoSegmentController implements IController {
  async handle(
    httpRequest: HttpRequest<unknown>,
    request: express.Request,
    response: express.Response
  ): Promise<HttpResponse<Readable | string>> {
    try {
      const segmentId = httpRequest?.params?.id;

      if (!segmentId) {
        return badRequest("Missing segment id");
      }

      const attachmentProxyId = decodeURIComponent(segmentId);
      const attachmentUrl = `https://cdn.discordapp.com/attachments/${attachmentProxyId}`;
      const attachmentUuid = attachmentProxyId.split("/").pop()!;

      const axiosResponse = await axios.get(attachmentUrl, {
        responseType: "stream",
      });

      if (axiosResponse && axiosResponse.data) {
        response.setHeader(
          "Content-Type",
          axiosResponse.headers["content-type"]
        );
        response.setHeader(
          "Content-Disposition",
          `attachment; filename=${attachmentUuid}`
        );
        //response.setHeader("Cache-Control", "public, max-age=43200");

        return ok<string>(axiosResponse.data);
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
