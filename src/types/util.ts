// Recursively extract all string literal routes from an object
export type RecursiveRoutePath<T> = T extends string
  ? T
  : T extends Record<string, unknown>
  ? RecursiveRoutePath<T[keyof T]>
  : never;
