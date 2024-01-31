import { ClientTypes } from "./protocols";
import { DataNest } from "./types/data-nest";
import { Course } from "../models/course";

export const Type = ClientTypes.DataNest;

export const DatabaseClient = {
  async connect() {
    if (Type === ClientTypes.DataNest) {
      await DataNest.connect();
    }
  },

  async getCourses(): Promise<Course[]> {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getCourses();
    }
    return [];
  },

  async getModulesWhere(courseId: string) {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getModulesWhere(courseId);
    }
    return [];
  },

  async getVideosWhere(courseId: string, module: string) {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getVideosWhere(courseId, module);
    }
    return [];
  },
};
