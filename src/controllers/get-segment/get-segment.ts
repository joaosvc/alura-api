import axios from "axios";
import express from "express";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";

export class GetVideoSegmentController implements IController {
  async handle(
    httpRequest: HttpRequest<unknown>,
    request: express.Request,
    response: express.Response
  ): Promise<HttpResponse<string>> {
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
        const contentType = axiosResponse.headers["content-type"];
        const contentLength = axiosResponse.headers["content-length"];

        response.setHeader("Content-Type", contentType);
        response.setHeader("Content-Length", contentLength);
        response.setHeader("Cache-Control", "public, max-age=43200");

        response.setHeader(
          "Content-Disposition",
          `attachment; filename=${attachmentUuid}`
        );

        axiosResponse.data.pipe(response, { end: true });

        return ok<string>("Streaming in progress");
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
