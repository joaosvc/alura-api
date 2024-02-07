import { DatabaseClient } from "../../database/client";
import { Category, CategoryWithModules } from "../../models/category/category";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { GetCategoriesParams } from "./protocols";

export class GetCategoriesController implements IController {
  async handle(
    httpRequest: HttpRequest<GetCategoriesParams>
  ): Promise<HttpResponse<Category[] | CategoryWithModules[] | string>> {
    try {
      const categories = await DatabaseClient.getCategories(
        httpRequest.body!.modules === true
      );

      return ok<Category[] | CategoryWithModules[]>(categories);
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
