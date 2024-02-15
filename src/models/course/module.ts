export interface Module {
  name: string;
}

export interface ModuleWithVideos {
  name: string;
  videos: {
    video: string;
    name: string;
  }[];
}

export interface Modules {
  courseName: string;
  modules: Module[] | ModuleWithVideos[];
}
