import { ClientTypes } from "./protocols";
import { DataNest } from "./types/data-nest";
import { Course } from "../models/course";
import { Module } from "../models/module";
import { Video } from "../models/video";

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
  ): Promise<Video> {
    if (Type === ClientTypes.DataNest) {
      return await DataNest.client.getVideoWhere(courseId, module, video);
    }

    throw new Error("Client not found");
  },
};
