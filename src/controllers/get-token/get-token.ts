import { encodeSession } from "../../middleware/session/encode-session";
import { EncodeResult } from "../../middleware/session/session-interface";
import { badRequest, ok, serverError } from "../helpers";
import { HttpResponse, IController } from "../protocols";

export class GetJwtTokenController implements IController {
  async handle(): Promise<HttpResponse<EncodeResult | string>> {
    try {
      return ok<EncodeResult>(encodeSession());
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
