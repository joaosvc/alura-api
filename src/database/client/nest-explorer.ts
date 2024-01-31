import { NestData } from "./data/nest-data";

export default class NestExplorer {
  async getCourses() {
    return Object.entries(NestData).map(([id, course]) => {
      return {
        id,
        name: course.name,
      };
    });
  }

  async getModulesWhere(courseId: string) {
    if (!NestData[courseId]) {
      throw new Error("Course not found");
    }

    return Object.keys(NestData[courseId].modules).map((module) => {
      return {
        courseId: courseId,
        module: module,
      };
    });
  }

  async getVideosWhere(courseId: string, module: string) {
    if (!NestData[courseId]) {
      throw new Error("Course not found");
    }

    if (!NestData[courseId].modules[module]) {
      throw new Error("Module not found");
    }

    return Object.entries(NestData[courseId].modules[module]).map(
      ([video, playlist]) => {
        return {
          courseId,
          module,
          video,
          playlist,
        };
      }
    );
  }
}
