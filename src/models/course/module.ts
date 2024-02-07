export interface Module {
  module: string;
}

export interface ModuleWithVideos extends Module {
  videos: string[];
}
