type Immutable<T> = {
  readonly [K in keyof T]: Immutable<T[K]>;
};

export default Immutable;
