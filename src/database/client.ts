import { ClientTypes } from "./protocols";
import { DataNest } from "./types/data-nest";
import { Course } from "../models/course/course";
import { Modules } from "../models/course/module";
import { VideoPath } from "../models/course/video";
import { Category, CategoryWithModules } from "../models/category/category";
import { CategoryModules } from "../models/category/modules";

export const Type = ClientTypes.DataNest;

export const DatabaseClient = {
  async connect() {
    console.log("Connecting to database...");

    if (Type === ClientTypes.DataNest) {
      await DataNest.connect();
    }
  },

  /**
   * Returns all courses
   * @returns {Promise<Course[]>} - A list of courses
   */
  async getCourses(): Promise<Course[]> {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getCourses();
    }
    return [];
  },

  /**
   * Returns the modules of a course
   * @param {string} courseId - The course ID(UUID)
   * @param {boolean} [videos=false] - Indicates whether videos should be included in modules
   */
  async getCourseModulesWhere(
    courseId: string,
    videos: boolean = false
  ): Promise<Modules> {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getModulesWhere(courseId, videos);
    }

    throw new Error("Client not found");
  },

  /**
   * Returns a video data
   * @param {string} courseId - The course ID(UUID)
   * @param {string} module - The module name
   * @param {string} video - The video name
   * @returns {Promise<VideoPath>} - A video data
   */
  async getVideoWhere(
    courseId: string,
    module: string,
    video: string
  ): Promise<VideoPath> {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getVideoWhere(courseId, module, video);
    }

    throw new Error("Client not found");
  },

  /**
   * Returns all categories
   * @param {boolean} [modules=false] - Indicates whether modules should be included in categories
   */
  async getCategories(
    modules: boolean = false
  ): Promise<Category[] | CategoryWithModules[]> {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getCategories(modules);
    }
    return [];
  },

  /**
   * Returns modules from a category
   * @param {string} category - The category name
   */
  async getCategoryModulesWhere(category: string): Promise<CategoryModules> {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getCategoryModulesWhere(category);
    }
    return {};
  },
};
