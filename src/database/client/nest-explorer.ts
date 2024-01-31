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

    return Object.keys(NestData[courseId].modules[module]).map((video) => {
      return {
        video,
      };
    });
  }

  async getVideoWhere(courseId: string, module: string, video: string) {
    if (!NestData[courseId]) {
      throw new Error("Course not found");
    }

    if (!NestData[courseId].modules[module]) {
      throw new Error("Module not found");
    }

    if (!NestData[courseId].modules[module][video]) {
      throw new Error("Video not found");
    }

    return {
      video,
      playlist: NestData[courseId].modules[module][video],
    };
  }
}
