export interface INestCoursesData {
  [uuid: string]: {
    name: string;
    modules: {
      [uuid: string]: {
        [name: string]: string;
      };
    };
  };
}

export interface INestCategoriesData {
  [category: string]: {
    [categoryModule: string]: {
      [courseName: string]: string;
    };
  };
}
