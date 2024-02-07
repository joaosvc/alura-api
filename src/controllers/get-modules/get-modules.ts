import { DatabaseClient } from "../../database/client";
import { Modules } from "../../models/course/module";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetModulesParams } from "./protocols";

export class GetModulesController implements IController {
  async handle(
    httpRequest: HttpRequest<GetModulesParams>
  ): Promise<HttpResponse<Modules | string>> {
    try {
      const requiredFields: (keyof GetModulesParams)[] = ["courseId"];

      for (const field of requiredFields) {
        const value = httpRequest?.body?.[field as keyof GetModulesParams];

        if (typeof value === "string" && !value.length) {
          return badRequest(`Field ${field} is required`);
        }
      }

      const modules = await DatabaseClient.getCourseModulesWhere(
        httpRequest.body!.courseId,
        httpRequest.body!.videos === true
      );

      return ok<Modules>(modules);
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
