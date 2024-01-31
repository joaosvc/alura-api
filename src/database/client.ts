import { ClientTypes } from "./protocols";
import { DataNest } from "./types/data-nest";
import { Course } from "../models/course/course";
import { Module } from "../models/course/module";
import { Video } from "../models/course/video";
import { VideoPlaylist } from "../models/course/playlist";
import { Category } from "../models/category/category";
import { CategoryModules } from "../models/category/modules";

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

  async getModulesWhere(courseId: string): Promise<Module[]> {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getModulesWhere(courseId);
    }
    return [];
  },

  async getVideosWhere(courseId: string, module: string): Promise<Video[]> {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getVideosWhere(courseId, module);
    }
    return [];
  },

  async getVideoWhere(
    courseId: string,
    module: string,
    video: string
  ): Promise<VideoPlaylist> {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getVideoWhere(courseId, module, video);
    }

    throw new Error("Client not found");
  },

  async getCategories(): Promise<Category[]> {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getCategories();
    }
    return [];
  },

  async getCategoryModulesWhere(category: string): Promise<CategoryModules> {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getCategoryModulesWhere(category);
    }
    return {};
  },
};
