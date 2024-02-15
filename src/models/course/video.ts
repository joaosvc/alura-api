export interface Video {
  name: string;
  url: string | null;
}

export interface VideoPath extends Video {
  path: string;
}
