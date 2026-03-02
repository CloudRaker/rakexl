import { toNumber } from "./conversion";

/**
 * Returns the absolute value of a number.
 *
 * @example
 * absoluteValue(-5) // 5
 * (-10)|absoluteValue // 10
 * absoluteValue(3.14) // 3.14
 * @group Math
 *
 * @param input The input number to get the absolute value of.
 * @returns The absolute value, or NaN if input cannot be converted to a number.
 */
export const absoluteValue = (input: unknown) => {
  const num = toNumber(input);
  return isNaN(num) ? NaN : Math.abs(num);
};

/**
 * Rounds a number down to the nearest integer.
 *
 * @example
 * floor(3.7) // 3
 * (3.14)|floor // 3
 * floor(-2.8) // -3
 * @group Math
 *
 * @param input The input number to round down.
 * @returns The rounded down integer, or NaN if input cannot be converted to a number.
 */
export const floor = (input: unknown) => {
  const num = toNumber(input);
  return isNaN(num) ? NaN : Math.floor(num);
};

/**
 * Rounds a number up to the nearest integer.
 *
 * @example
 * ceil(3.2) // 4
 * (3.14)|ceil // 4
 * ceil(-2.8) // -2
 * @group Math
 *
 * @param input The input number to round up.
 * @returns The rounded up integer, or NaN if input cannot be converted to a number.
 */
export const ceil = (input: unknown) => {
  const num = toNumber(input);
  return isNaN(num) ? NaN : Math.ceil(num);
};

/**
 * Rounds a number to the nearest integer or to specified decimal places.
 *
 * @example
 * round(3.7) // 4
 * round(3.14159, 2) // 3.14
 * (2.567)|round // 3
 * @group Math
 *
 * @param input The input number to round.
 * @param decimals Optional number of decimal places to round to.
 * @returns The rounded number, or NaN if input cannot be converted to a number.
 */
export const round = (input: unknown, decimals?: number) => {
  const num = toNumber(input);
  return isNaN(num)
    ? NaN
    : decimals
    ? Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
    : Math.round(num);
};

/**
 * Returns the value of a number raised to a power.
 *
 * @example
 * power(2, 3) // 8
 * (2)|power(4) // 16
 * power(9) // 81 (defaults to power of 2)
 * @group Math
 *
 * @param input The base number.
 * @param exponent The exponent to raise the base to. Defaults to 2.
 * @returns The result of base raised to the exponent, or NaN if input cannot be converted to a number.
 */
export const power = (input: unknown, exponent?: number) => {
  const num = toNumber(input);
  const exp = exponent === undefined ? 2 : exponent;
  return isNaN(num) ? NaN : Math.pow(num, exp);
};

/**
 * Returns the square root of a number.
 *
 * @example
 * sqrt(16) // 4
 * (25)|sqrt // 5
 * sqrt(2) // 1.4142135623730951
 * @group Math
 *
 * @param input The input number to get the square root of.
 * @returns The square root of the input, or NaN if input cannot be converted to a number.
 */
export const sqrt = (input: unknown) => {
  const num = toNumber(input);
  return isNaN(num) ? NaN : Math.sqrt(num);
};

/**
 * Generates a random number between 0 (inclusive) and 1 (exclusive).
 *
 * @example
 * randomNumber() // 0.123456789 (example output)
 * randomNumber() // 0.987654321 (different each time)
 * @group Math
 *
 * @returns A random floating-point number between 0 and 1.
 */
export const randomNumber = () => {
  return Math.random();
};

/**
 * Calculates the sum of an array of numbers.
 *
 * @example
 * sum([1, 2, 3, 4]) // 10
 * [1.5, 2.5, 3.0]|sum // 7
 * sum(1, 2, 3, 4) // 10
 * @group Math
 *
 * @param input The input array of numbers or individual number arguments.
 * @returns The sum of all numbers, or NaN if input is not an array.
 */
export const sum = (...input: unknown[]) => {
  if (!Array.isArray(input)) return NaN;
  return input.flat().reduce<number>((acc, val) => acc + toNumber(val), 0);
};

/**
 * Finds the maximum value in an array of numbers.
 *
 * @example
 * max([1, 5, 3, 2]) // 5
 * [10, 20, 15]|max // 20
 * max(1, 5, 3, 2) // 5
 * @group Math
 *
 * @param input The input array of numbers or individual number arguments.
 * @returns The maximum value, or NaN if input is not an array.
 */
export const max = (...input: unknown[]) => {
  if (!Array.isArray(input)) return NaN;
  return Math.max(...input.flat().map(toNumber));
};

/**
 * Finds the minimum value in an array of numbers.
 *
 * @example
 * min([1, 5, 3, 2]) // 1
 * [10, 20, 15]|min // 10
 * min(1, 5, 3, 2) // 1
 * @group Math
 *
 * @param input The input array of numbers or individual number arguments.
 * @returns The minimum value, or NaN if input is not an array.
 */
export const min = (...input: unknown[]) => {
  if (!Array.isArray(input)) return NaN;
  return Math.min(...input.flat().map(toNumber));
};

/**
 * Calculates the average of an array of numbers.
 *
 * @example
 * average([1, 2, 3, 4]) // 2.5
 * [10, 20, 30]|average // 20
 * average(1, 2, 3, 4) // 2.5
 * @group Math
 *
 * @param input The input array of numbers or individual number arguments.
 * @returns The average value, or NaN if input is not an array.
 */
export const average = (...input: unknown[]) => {
  if (!Array.isArray(input)) return NaN;
  const total = sum(...input);
  return total / input.flat().length;
};
