import { pad } from "./string";

/**
 * Casts the input to a string.
 *
 * @example
 * string(123) // "123"
 * 123|string // "123"
 * @group Conversion
 *
 * @param input The input can be any type.
 * @param prettify If true, the output will be pretty-printed.
 * @returns The input converted to a JSON string representation.
 */
export const toString = (input: unknown, prettify = false) => {
  return JSON.stringify(input, null, prettify ? 2 : 0);
};

/**
 * Parses the string and returns a JSON object.
 *
 * @example
 * toJson('{"key": "value"}') // { key: "value" }
 * '{"name": "John", "age": 30}'|toJson // { name: "John", age: 30 }
 * @group Conversion
 *
 * @param input The JSON string to parse.
 * @returns The parsed JSON object or value.
 * @throws {SyntaxError} If the string is not valid JSON.
 */
export const toJson = (input: string) => {
  return JSON.parse(input);
};

/**
 * Converts the input to a number.
 *
 * @example
 * toNumber("123") // 123
 * "45.67"|toNumber // 45.67
 * toNumber("abc") // NaN
 * @group Conversion
 *
 * @param input The input to convert to a number.
 * @returns The numeric value, or NaN if conversion fails.
 */
export const toNumber = (input: unknown) => {
  if (typeof input === "number") return input;
  if (typeof input === "string") return parseFloat(input);
  return NaN;
};

/**
 * Parses a string and returns an integer.
 *
 * @example
 * parseInteger("123") // 123
 * "45.67"|parseInteger // 45
 * parseInteger(123.89) // 123
 * @group Conversion
 *
 * @param input The input to parse as an integer.
 * @returns The integer value, or NaN if parsing fails.
 */
export const parseInteger = (input: unknown) => {
  if (typeof input === "string") {
    return parseInt(input, 10);
  } else if (typeof input === "number") {
    return Math.floor(input);
  }
  return NaN;
};

/**
 * Converts the input to a boolean.
 *
 * @example
 * toBoolean("true") // true
 * "false"|toBoolean // false
 * toBoolean(1) // true
 * toBoolean(0) // false
 * @group Conversion
 *
 * @param input The input to convert to a boolean.
 * @returns The boolean value, or undefined for ambiguous string values.
 */
export const toBoolean = (input: unknown) => {
  if (typeof input === "boolean") return input;
  if (typeof input === "number") return input !== 0;
  if (typeof input === "string") {
    if (input.trim().toLowerCase() === "true" || input.trim() === "1")
      return true;
    if (input.trim().toLowerCase() === "false" || input.trim() === "0")
      return false;
    else return undefined;
  }
  return Boolean(input);
};

/**
 * Formats a number to a decimal representation as specified by the format string.
 *
 * @example
 * formatNumber(1234.567, "#,##0.00") // "1,234.57"
 * (1000)|formatNumber("0.00") // "1000.00"
 * formatNumber(42, "#,###") // "42"
 * @group Conversion
 *
 * @param input The input number to format.
 * @param format The format string specifying decimal places and grouping.
 * @returns The formatted number string, or empty string if input cannot be converted to a number.
 */
export const formatNumber = (input: unknown, format: string) => {
  const num =
    typeof input === "number"
      ? input
      : parseInt(toNumber(input).toString(), 10);
  return isNaN(num)
    ? ""
    : num.toLocaleString("en-us", {
        minimumFractionDigits: format.split(".")[1]?.length,
        maximumFractionDigits: format.split(".")[1]?.length,
        useGrouping: format.split(".")[0]?.includes(","),
      });
};

/**
 * Formats a number as a string in the specified base.
 *
 * @example
 * formatBase(255, 16) // "ff"
 * (10)|formatBase(2) // "1010"
 * formatBase(64, 8) // "100"
 * @group Conversion
 *
 * @param input The input number to format.
 * @param base The numeric base to convert to (2-36).
 * @returns The number formatted in the specified base, or empty string if input cannot be converted to a number.
 */
export const formatBase = (input: unknown, base: number) => {
  const num =
    typeof input === "number"
      ? input
      : parseInt(toNumber(input).toString(), 10);
  return isNaN(num) ? "" : num.toString(base);
};

/**
 * Formats a number as an integer with zero padding.
 *
 * @example
 * formatInteger(42, "000") // "042"
 * (7)|formatInteger("0000") // "0007"
 * formatInteger(123, "00") // "123"
 * @group Conversion
 *
 * @param input The input number to format.
 * @param format The format string indicating the minimum number of digits.
 * @returns The zero-padded integer string, or empty string if input cannot be converted to a number.
 */
export const formatInteger = (input: unknown, format: string) => {
  const num = toNumber(input);
  return isNaN(num) ? "" : pad(Math.floor(num).toString(), -format.length, "0");
};
