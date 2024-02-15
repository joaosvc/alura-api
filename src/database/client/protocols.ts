export interface INestCoursesData {
  [uuid: string]: {
    name: string;
    icon: string;
    category: {
      name: string;
      module: string;
    };
    modules: {
      [module: string]: {
        name: string;
        videos: {
          [video: string]: {
            name: string;
            path: string;
            url: string | null;
          };
        };
      };
    };
  };
}

export interface INestCategoriesData {
  [category: string]: {
    [categoryModule: string]: {
      [courseName: string]: {
        uuid: string;
        icon: string;
      };
    };
  };
}
