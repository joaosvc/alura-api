import { DatabaseClient } from "../../database/client";
import { CategoryWithModules } from "../../models/category/category";
import { badRequest, ok, serverError } from "../helpers";
import { HttpResponse, IController } from "../protocols";

export class GetCategoriesWithModulesController implements IController {
  async handle(): Promise<HttpResponse<CategoryWithModules[] | string>> {
    try {
      const categories = await DatabaseClient.getCategoriesWithModules();

      return ok<CategoryWithModules[]>(categories);
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
