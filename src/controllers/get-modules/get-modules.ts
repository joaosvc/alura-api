import { DatabaseClient } from "../../database/client";
import { Module } from "../../models/course/module";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetModulesParams } from "./protocols";

export class GetModulesController implements IController {
  async handle(
    httpRequest: HttpRequest<GetModulesParams>
  ): Promise<HttpResponse<Module[] | string>> {
    try {
      const requiredFields: (keyof GetModulesParams)[] = ["courseId"];

      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof GetModulesParams]?.length) {
          return badRequest(`Field ${field} is required`);
        }
      }

      const modules = await DatabaseClient.getModulesWhere(
        httpRequest.body!.courseId
      );

      return ok<Module[]>(modules);
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
