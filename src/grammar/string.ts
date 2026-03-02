const splitRegex = /(?<!^)(?=[A-Z])|[`~!@#%^&*()|+\\\-=?;:'.,\s_']+/;

/**
 * Gets a substring of a string.
 *
 * @example
 * substring("hello world", 0, 5) // "hello"
 * @group String
 *
 * @param input The input string.
 * @param start The starting index of the substring.
 * @param length The length of the substring.
 * @returns The substring of the input string.
 */
export const substring = (
  input: unknown,
  start: number,
  length: number | undefined
) => {
  let str = input;
  if (typeof str !== "string") {
    str = JSON.stringify(str);
  }
  if (typeof str === "string") {
    let startNum = start;
    let len = length ?? str.length;

    if (startNum < 0) {
      startNum = str.length + start;
      if (startNum < 0) {
        startNum = 0;
      }
    }
    if (startNum + len > str.length) {
      len = str.length - startNum;
    }
    if (len < 0) {
      len = 0;
    }
    return str.substring(startNum, startNum + len);
  }
  return "";
};

/**
 * Returns the substring before the first occurrence of the character sequence chars in str.
 *
 * @example substringBefore("hello world", " ") // "hello"
 * @group String
 * @param input The input string.
 * @param chars The character sequence to search for.
 * @returns The substring before the first occurrence of the character sequence chars in str.
 */
export const substringBefore = (input: unknown, chars: unknown) => {
  const str = typeof input === "string" ? input : JSON.stringify(input);
  const charsStr = typeof chars === "string" ? chars : JSON.stringify(chars);
  const index = str.indexOf(charsStr);
  if (index === -1) {
    return str;
  }
  return str.substring(0, index);
};

/**
 * Returns the substring after the first occurrence of the character sequence chars in str.
 *
 * @example
 * substringAfter("hello world", " ") // "world"
 * @group String
 *
 * @param input The input string.
 * @param chars The character sequence to search for.
 * @returns The substring after the first occurrence of the character sequence chars in str.
 */
export const substringAfter = (input: unknown, chars: unknown) => {
  const str = typeof input === "string" ? input : JSON.stringify(input);
  const charsStr = typeof chars === "string" ? chars : JSON.stringify(chars);
  const index = str.indexOf(charsStr);
  if (index === -1) {
    return "";
  }
  return str.substring(index + charsStr.length);
};

/**
 * Converts the input string to uppercase.
 *
 * @example
 * uppercase("hello") // "HELLO"
 * "hello world"|uppercase // "HELLO WORLD"
 * @group String
 *
 * @param input The input to convert to uppercase. Non-string inputs are converted to JSON string first.
 * @returns The uppercase string.
 */
export const uppercase = (input: unknown) => {
  const str = typeof input === "string" ? input : JSON.stringify(input);
  return str.toUpperCase();
};

/**
 * Converts the input string to lowercase.
 *
 * @example
 * lowercase("HELLO") // "hello"
 * "HELLO WORLD"|lowercase // "hello world"
 * @group String
 *
 * @param input The input to convert to lowercase. Non-string inputs are converted to JSON string first.
 * @returns The lowercase string.
 */
export const lowercase = (input: unknown) => {
  const str = typeof input === "string" ? input : JSON.stringify(input);
  return str.toLowerCase();
};

/**
 * Converts the input string to camel case.
 *
 * @example
 * camelCase("foo bar") // "fooBar"
 * "hello-world"|camelCase // "helloWorld"
 * camelCase("HELLO_WORLD") // "helloWorld"
 * @group String
 *
 * @param input The input string to convert to camel case.
 * @returns The camel case string, or empty string if input is not a string.
 */
export const camelCase = (input: unknown) => {
  if (typeof input !== "string") return "";
  return input
    .split(splitRegex)
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

/**
 * Converts the input string to pascal case.
 *
 * @example
 * pascalCase("foo bar") // "FooBar"
 * "hello-world"|pascalCase // "HelloWorld"
 * pascalCase("HELLO_WORLD") // "HelloWorld"
 * @group String
 *
 * @param input The input string to convert to pascal case.
 * @returns The pascal case string, or empty string if input is not a string.
 */
export const pascalCase = (input: unknown) => {
  if (typeof input !== "string") return "";
  return input
    .split(splitRegex)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

/**
 * Trims whitespace from both ends of a string.
 *
 * @example
 * trim("  hello  ") // "hello"
 * "  world  "|trim // "world"
 * trim("__hello__", "_") // "hello"
 * @group String
 *
 * @param input The input string to trim.
 * @param trimChar Optional character to trim instead of whitespace.
 * @returns The trimmed string, or empty string if input is not a string.
 */
export const trim = (input: unknown, trimChar?: string) => {
  if (typeof input === "string") {
    if (trimChar) {
      return input.replace(new RegExp(`^${trimChar}+|${trimChar}+$`, "g"), "");
    }
    return input.trim();
  }
  return "";
};

/**
 * Pads the input string to the specified width.
 *
 * @example
 * pad("hello", 10) // "hello     "
 * pad("world", -8, "0") // "000world"
 * "foo"|pad(5, ".") // "foo.."
 * @group String
 *
 * @param input The input to pad. Non-string inputs are converted to JSON string first.
 * @param width The target width. Positive values pad to the right, negative values pad to the left.
 * @param char The character to use for padding. Defaults to space.
 * @returns The padded string.
 */
export const pad = (input: unknown, width: number, char: string = " ") => {
  const str = typeof input !== "string" ? JSON.stringify(input) : input;
  if (width > 0) {
    return str.padEnd(width, char);
  } else {
    return str.padStart(-width, char);
  }
};

/**
 * Checks if the input string or array contains the specified value.
 *
 * @example
 * contains("hello world", "world") // true
 * "foo-bar"|contains("bar") // true
 * contains([1, 2, 3], 2) // true
 * @group String
 *
 * @param input The input string or array to search in.
 * @param search The value to search for.
 * @returns True if the input contains the search value, false otherwise.
 */
export const contains = (input: unknown, search: string) => {
  if (typeof input === "string" || Array.isArray(input)) {
    return input.includes(search);
  }
  return false;
};

/**
 * Checks if the input string starts with the specified substring.
 *
 * @example
 * startsWith("hello world", "hello") // true
 * "foo-bar"|startsWith("foo") // true
 * startsWith("test", "xyz") // false
 * @group String
 *
 * @param input The input string to check.
 * @param search The substring to search for at the beginning.
 * @returns True if the input starts with the search string, false otherwise.
 */
export const startsWith = (input: unknown, search: string) => {
  if (typeof input === "string") {
    return input.startsWith(search);
  }
  return false;
};

/**
 * Checks if the input string ends with the specified substring.
 *
 * @example
 * endsWith("hello world", "world") // true
 * "foo-bar"|endsWith("bar") // true
 * endsWith("test", "xyz") // false
 * @group String
 *
 * @param input The input string to check.
 * @param search The substring to search for at the end.
 * @returns True if the input ends with the search string, false otherwise.
 */
export const endsWith = (input: unknown, search: string) => {
  if (typeof input === "string") {
    return input.endsWith(search);
  }
  return false;
};

/**
 * Splits the input string into an array of substrings.
 *
 * @example
 * split("foo,bar,baz", ",") // ["foo", "bar", "baz"]
 * "one-two-three"|split("-") // ["one", "two", "three"]
 * split("hello world", " ") // ["hello", "world"]
 * @group String
 *
 * @param input The input string to split.
 * @param separator The separator string to split on.
 * @returns An array of substrings, or empty array if input is not a string.
 */
export const split = (input: unknown, separator: string) => {
  if (typeof input === "string") {
    return input.split(separator);
  }
  return [];
};

/**
 * Replaces occurrences of a specified string with a replacement string.
 *
 * @example
 * replace("foo-bar-baz", "-", "_") // "foo_bar_baz"
 * "hello world"|replace("world", "there") // "hello there"
 * replace("test test test", "test", "demo") // "demo demo demo"
 * @group String
 *
 * @param input The input string to perform replacements on.
 * @param search The string to search for and replace.
 * @param replacement The string to replace matches with. Defaults to empty string.
 * @returns The string with replacements made, or undefined if input is not a string.
 */
export const replace = (
  input: unknown,
  search: string,
  replacement: string
) => {
  if (typeof input === "string" && typeof search === "string") {
    const _replacement = replacement === undefined ? "" : replacement;
    return input.replace(new RegExp(search, "g"), _replacement);
  }
  return undefined;
};
