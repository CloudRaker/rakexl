import jexl from "..";

/**
 * Returns a sub-array from start index to end index.
 *
 * @example
 * range([1, 2, 3, 4, 5], 1, 4) // [2, 3, 4]
 * [10, 20, 30, 40]|range(0, 2) // [10, 20]
 * range(["a", "b", "c", "d"], 2) // ["c", "d"]
 * @group Array
 *
 * @param array The input array.
 * @param start The starting index (inclusive).
 * @param end The ending index (exclusive). If not provided, slices to the end of the array.
 * @returns The sub-array from start to end, or empty array if input is not an array.
 */
export const arrayRange = (array: unknown[], start: number, end?: number) => {
  if (!Array.isArray(array)) return [];
  return array.slice(start, end);
};

/**
 * Appends elements to an array.
 *
 * @example
 * append([1, 2], 3) // [1, 2, 3]
 * [1, 2]|append(3, 4) // [1, 2, 3, 4]
 * append([], 1, 2, 3) // [1, 2, 3]
 * @group Array
 *
 * @param input The input values to append to an array.
 * @returns A new array with all inputs flattened and appended, or empty array if no valid input.
 */
export const arrayAppend = (...input: unknown[]) => {
  if (!Array.isArray(input)) return [];
  return [...input.flat()];
};

/**
 * Reverses the elements of an array.
 *
 * @example
 * reverse([1, 2, 3]) // [3, 2, 1]
 * [1, 2, 3]|reverse // [3, 2, 1]
 * reverse(["a", "b", "c"]) // ["c", "b", "a"]
 * @group Array
 *
 * @param input The input values to reverse.
 * @returns A new array with elements in reverse order, or empty array if no valid input.
 */
export const arrayReverse = (...input: unknown[]) => {
  if (!Array.isArray(input)) return [];
  return [...input.flat()].reverse();
};

/**
 * Shuffles the elements of an array randomly.
 *
 * @example
 * shuffle([1, 2, 3]) // [2, 1, 3] (random order)
 * [1, 2, 3]|shuffle // [3, 1, 2] (random order)
 * shuffle(["a", "b", "c"]) // ["c", "a", "b"] (random order)
 * @group Array
 *
 * @param input The input array to shuffle.
 * @returns The same array with elements randomly shuffled, or empty array if input is not an array.
 */
export const arrayShuffle = (input: unknown[]) => {
  if (!Array.isArray(input)) return [];
  for (let i = input.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [input[i], input[j]] = [input[j], input[i]];
  }
  return input;
};

/**
 * Sorts the elements of an array.
 *
 * @example
 * sort([3, 1, 2]) // [1, 2, 3]
 * [3, 1, 2]|sort // [1, 2, 3]
 * sort([{age: 30}, {age: 20}], "age") // [{age: 20}, {age: 30}]
 * sort([{age: 30}, {age: 20}], "age", true) // [{age: 30}, {age: 20}]
 * @group Array
 *
 * @param input The input array to sort.
 * @param expression Optional JEXL expression to determine sort value for objects.
 * @param descending Optional flag to sort in descending order.
 * @returns A new sorted array, or empty array if input is not an array.
 */
export const arraySort = (
  input: unknown[],
  expression?: string,
  descending?: boolean
) => {
  if (!Array.isArray(input)) return [];
  if (!expression) return [...input].sort();
  const expr = jexl.compile(expression);
  const compareFunction = (a: unknown, b: unknown) => {
    const aValue = expr.evalSync(a);
    const bValue = expr.evalSync(b);
    if (aValue < bValue) return descending ? -1 : 1;
    if (aValue > bValue) return descending ? 1 : -1;
    return 0;
  };
  return [...input].sort(compareFunction);
};

/**
 * Returns a new array with duplicate elements removed.
 *
 * @example
 * distinct([1, 2, 2, 3, 1]) // [1, 2, 3]
 * [1, 2, 2, 3]|distinct // [1, 2, 3]
 * distinct(["a", "b", "a", "c"]) // ["a", "b", "c"]
 * @group Array
 *
 * @param input The input array to remove duplicates from.
 * @returns A new array with duplicates removed, or empty array if input is not an array.
 */
export const arrayDistinct = (input: unknown[]) => {
  if (!Array.isArray(input)) return [];
  return [...new Set(input)];
};

/**
 * Creates a new object based on key-value pairs or string keys.
 *
 * @example
 * toObject([["name", "John"], ["age", 30]]) // {name: "John", age: 30}
 * toObject("name", "John") // {name: "John"}
 * toObject(["key1", "key2"], "defaultValue") // {key1: "defaultValue", key2: "defaultValue"}
 *
 * @group Array
 *
 * @param input The input string key or array of key-value pairs.
 * @param val Optional default value for string keys or when array elements are strings.
 * @returns A new object created from the input, or empty object if input is invalid.
 */
export const arrayToObject = (input: unknown, val?: unknown) => {
  if (typeof input === "string") return { [input]: val };
  if (!Array.isArray(input)) return {};
  return input.reduce((acc, kv) => {
    if (Array.isArray(kv) && kv.length === 2) {
      acc[kv[0]] = kv[1];
      return acc;
    } else if (typeof kv === "string") {
      acc[kv] = val;
      return acc;
    }
    return acc;
  }, {});
};

/**
 * Returns a new array with elements transformed by extracting a specific field.
 *
 * @example
 * mapField([{name: "John"}, {name: "Jane"}], "name") // ["John", "Jane"]
 * [{age: 30}, {age: 25}]|mapField("age") // [30, 25]
 * mapField([{x: 1, y: 2}, {x: 3, y: 4}], "x") // [1, 3]
 * @group Array
 *
 * @param input The input array of objects to extract fields from.
 * @param field The field name to extract from each object.
 * @returns A new array with extracted field values, or empty array if input is not an array.
 */
export const mapField = (input: unknown[], field: string) => {
  if (!Array.isArray(input)) return [];
  return input.map((item) => item[field]);
};

/**
 * Returns an array containing the results of applying the expression parameter to each value in the array parameter.
 * The expression must be a valid JEXL expression string, which is applied to each element of the array.
 * The relative context provided to the expression is an object with the properties value, index and array (the original array).
 *
 * @example
 * map([1, 2, 3], "value * 2") // [2, 4, 6]
 * [{name: "John"}, {name: "Jane"}]|map("value.name") // ["John", "Jane"]
 * map([1, 2, 3], "value + index") // [1, 3, 5]
 * @group Array
 *
 * @param input The input array to transform.
 * @param expression The JEXL expression to apply to each element.
 * @returns A new array with transformed elements, or undefined if input is not an array.
 */
export const arrayMap = (input: unknown[], expression: string) => {
  if (!Array.isArray(input)) return undefined;
  const expr = jexl.compile(expression);
  return input.map((value, index, array) => {
    return expr.evalSync({ value, index, array });
  });
};

/**
 * Checks whether the provided array has any elements that match the specified expression.
 * The expression must be a valid JEXL expression string, and is applied to each element of the array.
 * The relative context provided to the expression is an object with the properties value, index and array (the original array).
 *
 * @example
 * any([1, 2, 3], "value > 2") // true
 * [{age: 25}, {age: 35}]|any("value.age > 30") // true
 * any([1, 2, 3], "value > 5") // false
 * @group Array
 *
 * @param input The input array to test.
 * @param expression The JEXL expression to test against each element.
 * @returns True if any element matches the expression, false otherwise or if input is not an array.
 */
export const arrayAny = (input: unknown[], expression: string) => {
  if (!Array.isArray(input)) return false;
  const expr = jexl.compile(expression);
  return input.some((value, index, array) => {
    return expr.evalSync({ value, index, array });
  });
};

/**
 * Checks whether the provided array has all elements that match the specified expression.
 * The expression must be a valid JEXL expression string, and is applied to each element of the array.
 * The relative context provided to the expression is an object with the properties value, index and array (the original array).
 *
 * @example
 * every([2, 4, 6], "value % 2 == 0") // true
 * [{age: 25}, {age: 35}]|every("value.age > 20") // true
 * every([1, 2, 3], "value > 2") // false
 * @group Array
 *
 * @param input The input array to test.
 * @param expression The JEXL expression to test against each element.
 * @returns True if all elements match the expression, false otherwise or if input is not an array.
 */
export const arrayEvery = (input: unknown[], expression: string) => {
  if (!Array.isArray(input)) return false;
  const expr = jexl.compile(expression);
  return input.every((value, index, array) => {
    return expr.evalSync({ value, index, array });
  });
};

/**
 * Returns a new array with the elements of the input array that match the specified expression.
 * The expression must be a valid JEXL expression string, and is applied to each element of the array.
 * The relative context provided to the expression is an object with the properties value, index and array (the original array).
 *
 * @example
 * filter([1, 2, 3, 4], "value > 2") // [3, 4]
 * [{age: 25}, {age: 35}]|filter("value.age > 30") // [{age: 35}]
 * filter([1, 2, 3, 4], "value % 2 == 0") // [2, 4]
 * @group Array
 *
 * @param input The input array to filter.
 * @param expression The JEXL expression to test against each element.
 * @returns A new array containing only elements that match the expression, or empty array if input is not an array.
 */
export const arrayFilter = (input: unknown[], expression: string) => {
  if (!Array.isArray(input)) return [];
  const expr = jexl.compile(expression);
  return input.filter((value, index, array) => {
    return expr.evalSync({ value, index, array });
  });
};

/**
 * Finds the first element in an array that matches the specified expression.
 * The expression must be a valid JEXL expression string, and is applied to each element of the array.
 * The relative context provided to the expression is an object with the properties value, index and array (the original array).
 *
 * @example
 * find([1, 2, 3, 4], "value > 2") // 3
 * [{name: "John"}, {name: "Jane"}]|find("value.name == 'Jane'") // {name: "Jane"}
 * find([1, 2, 3], "value > 5") // undefined
 * @group Array
 *
 * @param input The input array to search.
 * @param expression The JEXL expression to test against each element.
 * @returns The first element that matches the expression, or undefined if no match found or input is not an array.
 */
export const arrayFind = (input: unknown[], expression: string) => {
  if (!Array.isArray(input)) return undefined;
  const expr = jexl.compile(expression);
  return input.find((value, index, array) => {
    return expr.evalSync({ value, index, array });
  });
};

/**
 *
 * Finds the index of the first element in the input array that satisfies the given Jexl expression.
 *
 * @example
 * [1, 2, 3, 4]|findIndex('value > 2'); // returns 2
 * @group Array
 *
 * @param input - The array to search through.
 * @param expression - A Jexl expression string to evaluate for each element. The expression has access to `value`, `index`, and `array`.
 * @returns The index of the first matching element, or `-1` if no element matches, or `undefined` if the input is not an array.
 */
export const arrayFindIndex = (input: unknown[], expression: string) => {
  if (!Array.isArray(input)) return undefined;
  const expr = jexl.compile(expression);
  return input.findIndex((value, index, array) => {
    return expr.evalSync({ value, index, array });
  });
};

/**
 * Returns an aggregated value derived from applying the function parameter successively to each value in array in combination with the result of the previous application of the function.
 * The expression must be a valid JEXL expression string, and behaves like an infix operator between each value within the array.
 * The relative context provided to the expression is an object with the properties accumulator, value, index and array (the original array).
 *
 * @example
 * reduce([1, 2, 3, 4], "accumulator + value", 0) // 10
 * [1, 2, 3]|reduce("accumulator * value", 1) // 6
 * reduce(["a", "b", "c"], "accumulator + value", "") // "abc"
 * @group Array
 *
 * @param input The input array to reduce.
 * @param expression The JEXL expression to apply for each reduction step.
 * @param initialValue The initial value for the accumulator.
 * @returns The final accumulated value, or undefined if input is not an array.
 */
export const arrayReduce = (
  input: unknown[],
  expression: string,
  initialValue: unknown
) => {
  if (!Array.isArray(input)) return undefined;
  const expr = jexl.compile(expression);
  return input.reduce((accumulator, value, index, array) => {
    return expr.evalSync({ accumulator, value, index, array });
  }, initialValue);
};

/**
 * Joins elements of an array into a string.
 *
 * @example
 * arrayJoin(["foo", "bar", "baz"], ",") // "foo,bar,baz"
 * ["one", "two", "three"]|arrayJoin("-") // "one-two-three"
 * arrayJoin([1, 2, 3]) // "1,2,3"
 * @group Array
 *
 * @param input The input array to join.
 * @param separator The separator string to use between elements. Defaults to comma.
 * @returns The joined string, or undefined if input is not an array.
 */
export const arrayJoin = (input: unknown, separator?: string) => {
  if (Array.isArray(input)) {
    return input.join(separator);
  }
  return undefined;
};
