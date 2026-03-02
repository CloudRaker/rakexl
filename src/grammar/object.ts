/**
 * Returns the keys of an object as an array.
 *
 * @example
 * keys({name: "John", age: 30}) // ["name", "age"]
 * {a: 1, b: 2}|keys // ["a", "b"]
 * keys({}) // []
 * @group Array
 *
 * @param input The input object to get keys from.
 * @returns An array of object keys, or undefined if input is not an object.
 */
export const objectKeys = (input: unknown) => {
  if (typeof input === "object" && input !== null) {
    return Object.keys(input);
  }
  return undefined;
};

/**
 * Returns the values of an object as an array.
 *
 * @example
 * values({name: "John", age: 30}) // ["John", 30]
 * {a: 1, b: 2}|values // [1, 2]
 * values({}) // []
 * @group Object
 *
 * @param input The input object to get values from.
 * @returns An array of object values, or undefined if input is not an object.
 */
export const objectValues = (input: unknown) => {
  if (typeof input === "object" && input !== null) {
    return Object.values(input);
  }
  return undefined;
};

/**
 * Returns an array of key-value pairs from the input object.
 *
 * @example
 * entries({name: "John", age: 30}) // [["name", "John"], ["age", 30]]
 * {a: 1, b: 2}|entries // [["a", 1], ["b", 2]]
 * entries({}) // []
 * @group Object
 *
 * @param input The input object to get entries from.
 * @returns An array of [key, value] pairs, or undefined if input is not an object.
 */
export const objectEntries = (input: unknown) => {
  if (typeof input === "object" && input !== null) {
    return Object.entries(input);
  }
  return undefined;
};

/**
 * Returns a new object with the properties of the input objects merged together.
 *
 * @example
 * merge({a: 1}, {b: 2}) // {a: 1, b: 2}
 * {a: 1}|merge({b: 2}, {c: 3}) // {a: 1, b: 2, c: 3}
 * merge({a: 1}, {a: 2}) // {a: 2} (later values override)
 * @group Object
 *
 * @param args The input objects to merge.
 * @returns A new object with all properties merged together.
 */
export const objectMerge = (...args: unknown[]) => {
  return args.reduce<Record<string, unknown>>((acc, obj) => {
    if (!Array.isArray(obj) && typeof obj === "object" && obj !== null) {
      return { ...acc, ...obj };
    }
    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (typeof item === "object" && item !== null) {
          acc = { ...acc, ...item };
        }
      }
    }
    return acc;
  }, {});
};
