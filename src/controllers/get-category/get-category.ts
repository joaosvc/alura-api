import { DatabaseClient } from "../../database/client";
import { CategoryModules } from "../../models/category/modules";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetCategoryModulesParams } from "./protocols";

export class GetCategoryModulesController implements IController {
  async handle(
    httpRequest: HttpRequest<GetCategoryModulesParams>
  ): Promise<HttpResponse<CategoryModules | string>> {
    try {
      const requiredFields: (keyof GetCategoryModulesParams)[] = ["category"];

      for (const field of requiredFields) {
        if (
          !httpRequest?.body?.[field as keyof GetCategoryModulesParams]?.length
        ) {
          return badRequest(`Field ${field} is required`);
        }
      }

      const modules = await DatabaseClient.getCategoryModulesWhere(
        httpRequest.body!.category
      );

      return ok<CategoryModules>(modules);
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
