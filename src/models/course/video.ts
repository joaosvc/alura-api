export interface Video {
  name: string;
  url?: string;
  thumbnail?: string;
}

export interface VideoPath {
  name: string;
  path: string;
  url: string | null;
}
