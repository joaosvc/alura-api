export interface INestCoursesData {
  [uuid: string]: {
    name: string;
    icon: string;
    category: {
      name: string;
      module: string;
    };
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
      [courseName: string]: {
        uuid: string;
        icon: string;
      };
    };
  };
}

export interface INestCoursesLegacyData {
  [uuid: string]: {
    name: string;
    modules: {
      [uuid: string]: {
        [name: string]: string;
      };
    };
  };
}

export interface INestCategoriesLegacyData {
  [category: string]: {
    [categoryModule: string]: {
      [courseName: string]: string;
    };
  };
}
