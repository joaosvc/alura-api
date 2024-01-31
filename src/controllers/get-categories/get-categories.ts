import { DatabaseClient } from "../../database/client";
import { Category } from "../../models/category/category";
import { badRequest, ok, serverError } from "../helpers";
import { HttpResponse, IController } from "../protocols";

export class GetCategoriesController implements IController {
  async handle(): Promise<HttpResponse<Category[] | string>> {
    try {
      const categories = await DatabaseClient.getCategories();

      return ok<Category[]>(categories);
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
