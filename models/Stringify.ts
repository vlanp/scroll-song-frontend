type Stringify<T> = {
  [P in keyof T]: string;
};

const stringifyObject = <T extends object>(obj: T): Stringify<T> => {
  const result = {} as Stringify<T>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === "string") {
        result[key] = obj[key];
      } else {
        result[key] = JSON.stringify(obj[key]);
      }
    }
  }

  return result;
};

const parseObject = <T extends object>(stringifiedObj: Stringify<T>): T => {
  const result = {} as T;

  for (const key in stringifiedObj) {
    if (Object.prototype.hasOwnProperty.call(stringifiedObj, key)) {
      try {
        result[key] = JSON.parse(stringifiedObj[key]);
      } catch {
        result[key] = stringifiedObj[key] as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
};

export type { Stringify };
export { stringifyObject, parseObject };
