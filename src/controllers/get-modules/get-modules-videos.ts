import { DatabaseClient } from "../../database/client";
import { ModuleWithVideos } from "../../models/course/module";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetModulesParams } from "./protocols";

export class GetModulesWithVideosController implements IController {
  async handle(
    httpRequest: HttpRequest<GetModulesParams>
  ): Promise<HttpResponse<ModuleWithVideos[] | string>> {
    try {
      const requiredFields: (keyof GetModulesParams)[] = ["courseId"];

      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof GetModulesParams]?.length) {
          return badRequest(`Field ${field} is required`);
        }
      }

      const modules = await DatabaseClient.getModulesWithVideosWhere(
        httpRequest.body!.courseId
      );

      return ok<ModuleWithVideos[]>(modules);
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
