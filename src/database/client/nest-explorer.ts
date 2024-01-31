import { NestCoursesData, NestCategoriesData } from "./data/nest-data";

export default class NestExplorer {
  async getCourses() {
    return Object.entries(NestCoursesData).map(([id, course]) => {
      return {
        id,
        name: course.name,
      };
    });
  }

  async getModulesWhere(courseId: string) {
    if (!NestCoursesData[courseId]) {
      throw new Error("Course not found");
    }

    return Object.keys(NestCoursesData[courseId].modules).map((module) => {
      return {
        module: module,
      };
    });
  }

  async getVideosWhere(courseId: string, module: string) {
    if (!NestCoursesData[courseId]) {
      throw new Error("Course not found");
    }

    if (!NestCoursesData[courseId].modules[module]) {
      throw new Error("Module not found");
    }

    return Object.keys(NestCoursesData[courseId].modules[module]).map(
      (video) => {
        return {
          video,
        };
      }
    );
  }

  async getVideoWhere(courseId: string, module: string, video: string) {
    if (!NestCoursesData[courseId]) {
      throw new Error("Course not found");
    }

    if (!NestCoursesData[courseId].modules[module]) {
      throw new Error("Module not found");
    }

    if (!NestCoursesData[courseId].modules[module][video]) {
      throw new Error("Video not found");
    }

    return {
      video,
      playlist: NestCoursesData[courseId].modules[module][video],
    };
  }

  async getCategories() {
    return Object.keys(NestCategoriesData).map((category) => {
      return {
        category,
      };
    });
  }

  async getCategoryModulesWhere(category: string) {
    if (!NestCategoriesData[category]) {
      throw new Error("Category not found");
    }

    return NestCategoriesData[category];
  }
}
