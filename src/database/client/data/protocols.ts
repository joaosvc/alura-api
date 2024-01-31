export interface INestData {
  [uuid: string]: {
    name: string;
    modules: {
      [uuid: string]: {
        [name: string]: string;
      };
    };
  };
}
