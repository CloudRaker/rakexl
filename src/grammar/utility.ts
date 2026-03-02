import { v4 as uuidv4 } from "uuid";
import { toBoolean } from "./conversion";
import jexl from "..";

/**
 * Returns the number of characters in a string, or the length of an array.
 *
 * @example
 * length("hello") // 5
 * length([1, 2, 3]) // 3
 * @group Utility
 *
 * @param input The input can be a string, an array, or an object.
 * @returns The number of characters in a string, or the length of an array.
 */
export const length = (input: unknown) => {
  if (typeof input === "string") {
    return input.length;
  }
  if (Array.isArray(input)) {
    return input.length;
  }
  if (typeof input === "object" && input !== null) {
    return Object.keys(input).length;
  }
  return 0;
};

/**
 * Returns the logical NOT of the input.
 *
 * @example
 * not(true) // false
 * false|not // true
 * not(0) // true
 * not("") // true
 * @group Utility
 *
 * @param input The input to apply logical NOT to.
 * @returns The logical NOT of the input converted to boolean.
 */
export const not = (input: unknown) => {
  return !toBoolean(input);
};

/**
 * Evaluates a list of predicates and returns the first result expression whose predicate is satisfied.
 *
 * @example
 * switch(expression, case1, result1, case2, result2, ..., default)
 * @group Utility
 *
 * @param args The arguments array where the first element is the expression to evaluate, followed by pairs of case and result, and optionally a default value.
 * @returns The result of the first case whose predicate is satisfied, or the default value if no case is satisfied.
 */
export const switchCase = (...args: unknown[]) => {
  if (args.length < 3) return null;

  const expressionResult = args[0];

  for (let i = 1; i < args.length - 1; i += 2) {
    const caseResult = args[i];
    if (JSON.stringify(expressionResult) === JSON.stringify(caseResult)) {
      return args[i + 1];
    }
  }
  // Return default
  if (args.length % 2 === 0) {
    const defaultResult = args[args.length - 1];
    return defaultResult;
  }
  // Return null if no default specified
  return null;
};

/**
 * Evaluates a JEXL expression and returns the result.
 * If only one argument is provided, it is expected that the first argument is a JEXL expression.
 * If two arguments are provided, the first argument is the context (must be an object) and the second argument is the JEXL expression.
 * The expression uses the default JEXL extended grammar and can't use any custom defined functions or transforms.
 *
 * @example
 * _eval("1 + 2") // 3
 * _eval({x: 5, y: 10}, "x + y") // 15
 * "2 * 3"|_eval // 6
 * _eval({name: "John"}, "name") // "John"
 * @group Utility
 *
 * @param input Either a JEXL expression string or a context object.
 * @param expression Optional JEXL expression when first argument is context.
 * @returns The result of evaluating the expression, or undefined if evaluation fails.
 */
export const _eval = (input: unknown, expression: string) => {
  if (expression === undefined) {
    const _input = typeof input === "string" ? input : JSON.stringify(input);
    return jexl.evalSync(_input);
  }
  if (typeof input === "object") {
    return jexl.evalSync(expression, input);
  }
  return undefined;
};

/**
 * Generates a new UUID (Universally Unique Identifier).
 *
 * @example
 * uuid() // "123e4567-e89b-12d3-a456-426614174000"
 * uuid() // "987fcdeb-51a2-43d7-b123-456789abcdef" (different each time)
 * @group Utility
 *
 * @returns A new UUID v4 string.
 */
export const uuid = () => {
  return uuidv4();
};

/**
 * Returns the type of the input value as a string.
 *
 * Supported return values:
 * - "string", "number", "boolean", "undefined", "array", "object"
 * - Only for JS: "function", "symbol", "bigint"
 *
 * @param input - The value to check the type of.
 * @returns {string} The type of the input value.
 *
 * @example
 * type(5); // "number"
 * foo|type; // "string"
 * type(true); // "boolean"
 * [1,2,3]|type; // "array"
 * {foo:1}|type; // "object"
 * undefined|type; // "undefined"
 */
export const getType = (input: unknown): string => {
  if (input === null) return "null";
  if (Array.isArray(input)) return "array";
  return typeof input;
};
