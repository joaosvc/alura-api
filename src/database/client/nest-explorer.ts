import { Category, CategoryWithModules } from "../../models/category/category";
import { NestCoursesData } from "./data/nest-data";
import { INestCategoriesData } from "./data/protocols";

export default class NestExplorer {
  private nestCategoriesData: INestCategoriesData = {};

  constructor() {
    this.initNestCategoriesData();
  }

  private initNestCategoriesData() {
    for (const [uuid, data] of Object.entries(NestCoursesData)) {
      const { name, module } = data.category;

      if (!this.nestCategoriesData[name]) {
        this.nestCategoriesData[name] = {};
      }

      if (!this.nestCategoriesData[name][module]) {
        this.nestCategoriesData[name][module] = {};
      }

      this.nestCategoriesData[name][module][data.name] = {
        uuid,
        icon: data.icon,
      };
    }
  }

  async getCourses() {
    return Object.entries(NestCoursesData).map(([id, course]) => {
      return {
        id,
        name: course.name,
      };
    });
  }

  async getModulesWhere(courseId: string, videos: boolean = false) {
    if (!NestCoursesData[courseId]) {
      throw new Error("Course not found");
    }

    return {
      courseName: NestCoursesData[courseId].name,
      modules: Object.keys(NestCoursesData[courseId].modules).map((module) => {
        const result = { module };

        return videos ? { ...result, videos: Object.keys(module) } : result;
      }),
    };
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

  async getCategories(
    modules: boolean = false
  ): Promise<Category[] | CategoryWithModules[]> {
    return Object.entries(this.nestCategoriesData).map(([category, data]) => {
      return modules ? { category, modules: Object.keys(data) } : { category };
    });
  }

  async getCategoryModulesWhere(category: string) {
    if (!this.nestCategoriesData[category]) {
      throw new Error("Category not found");
    }

    return this.nestCategoriesData[category];
  }
}
