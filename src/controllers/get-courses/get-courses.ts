import { DatabaseClient } from "../../database/client";
import { Course } from "../../models/course";
import { ok, serverError } from "../helpers";
import { HttpResponse, IController } from "../protocols";

export class GetCoursesController implements IController {
  async handle(): Promise<HttpResponse<Course[] | string>> {
    try {
      const courses = await DatabaseClient.getCourses();

      return ok<Course[]>(courses);
    } catch (error) {
      return serverError();
    }
  }
}
