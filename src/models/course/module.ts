export interface Module {
  name: string;
  module: string;
}

export interface ModuleWithVideos extends Module {
  videos: {
    video: string;
    name: string;
  }[];
}

export interface Modules {
  courseName: string;
  modules: Module[] | ModuleWithVideos[];
}
