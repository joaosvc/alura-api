export interface Module {
  module: string;
}

export interface ModuleWithVideos extends Module {
  videos: string[];
}

export interface Modules {
  courseName: string;
  modules: Module[] | ModuleWithVideos[];
}
