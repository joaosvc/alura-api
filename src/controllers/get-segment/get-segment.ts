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
      // const attachmentUuid = attachmentProxyId.split("/").pop()!;

      const axiosResponse = await axios.get(attachmentUrl, {
        responseType: "stream",
      });

      const contentType = axiosResponse.headers["content-type"];
      const contentLength = axiosResponse.headers["content-length"];

      response.setHeader("Content-Type", contentType);
      response.setHeader("Content-Length", contentLength);

      // response.setHeader(
      //   "Content-Disposition",
      //   `attachment; filename=${attachmentUuid}`
      // );

      // axiosResponse.data.pipe(response, { end: true });

      const chunkSize = 3 * 1024 * 1024;

      let offset = 0;
      let remaining = contentLength;

      const sendChunk = () => {
        const end = Math.min(offset + chunkSize, contentLength);

        if (offset < contentLength) {
          axiosResponse.data.pipe(response, { start: offset, end });

          offset += chunkSize;
          remaining -= chunkSize;

          if (remaining <= 0) {
            response.end();
          }
        }
      };

      sendChunk();

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
