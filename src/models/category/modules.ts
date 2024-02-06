export interface CategoryModules {
  [module: string]: {
    [course: string]: {
      uuid: string;
      icon: string;
    };
  };
}
