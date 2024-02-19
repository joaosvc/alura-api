import { Category, CategoryWithModules } from "../../models/category/category";
import { NestData } from "./data/nest-data";
import { INestCategoriesData, INestCoursesData } from "./protocols";

export default class NestExplorer {
  private nestData: INestCoursesData = {};
  private nestCategoriesData: INestCategoriesData = {};

  public async init() {
    await this.initNestData();
    await this.initNestCategoriesData();
  }

  private async initNestData() {
    this.nestData = NestData.JSON;
  }

  private async initNestCategoriesData() {
    for (const [uuid, data] of Object.entries(this.nestData)) {
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
    return Object.entries(this.nestData).map(([id, course]) => {
      return {
        id,
        name: course.name,
      };
    });
  }

  async getModulesWhere(courseId: string, videos: boolean = false) {
    if (!this.nestData[courseId]) {
      throw new Error("Course not found");
    }

    return {
      courseName: this.nestData[courseId].name,
      modules: Object.entries(this.nestData[courseId].modules).map(
        ([module, moduleData]) => {
          const result = { name: moduleData.name, module };

          return videos
            ? {
                ...result,
                videos: Object.keys(moduleData.videos).map((video) => {
                  return {
                    video,
                    name: moduleData.videos[video].name,
                  };
                }),
              }
            : result;
        }
      ),
    };
  }

  async getVideoWhere(courseId: string, module: string, video: string) {
    if (!this.nestData[courseId]) {
      throw new Error("Course not found");
    }

    if (!this.nestData[courseId].modules[module]) {
      throw new Error("Module not found");
    }

    if (!this.nestData[courseId].modules[module].videos[video]) {
      throw new Error("Video not found");
    }

    return this.nestData[courseId].modules[module].videos[video];
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
