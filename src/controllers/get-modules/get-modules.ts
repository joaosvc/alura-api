import { DatabaseClient } from "../../database/client";
import { Module } from "../../models/module";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetModulesParams } from "./protocols";

export class GetModulesController implements IController {
  async handle(
    httpRequest: HttpRequest<GetModulesParams>
  ): Promise<HttpResponse<Module[] | string>> {
    try {
      const courseId = httpRequest?.params?.courseId;

      if (!courseId) {
        return badRequest("Missing course id");
      }
      const modules = await DatabaseClient.getModulesWhere(courseId);

      return ok<Module[]>(modules);
    } catch (error) {
      return serverError();
    }
  }
}
