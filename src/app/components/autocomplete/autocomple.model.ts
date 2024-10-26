export interface AutocompleteConfig<T> {
    labelFn: (item: T) => string;
    filterFn: (query: string, items: T[]) => T[];
  }