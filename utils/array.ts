export {};

declare global {
  interface Array<T> {
    distinct(): T[];
  }
}

Array.prototype.distinct = function <T>(): T[] {
  return this.filter(
    (value: T, index: number, array: T[]) => array.indexOf(value) === index
  );
};
