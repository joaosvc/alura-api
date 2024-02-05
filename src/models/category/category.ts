export interface Category {
  category: string;
}

export interface CategoryWithModules extends Category {
  modules: string[];
}
