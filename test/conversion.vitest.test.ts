import { expect, test } from "vitest";
import jexl from "../src";

test("convert to string", () => {
  expect(jexl.evalSync("string(123)")).toBe("123");
  expect(jexl.evalSync("123456|string")).toBe("123456");
  expect(jexl.evalSync(`{a:123456}|string`)).toBe('{"a":123456}');
});

test("formatting", () => {
  expect(jexl.evalSync('16325.62|formatNumber("0,0.000")')).toBe("16,325.620");
  expect(jexl.evalSync('16325.62|formatNumber("0.000")')).toBe("16325.620");
  expect(jexl.evalSync("12|formatBase(16)")).toBe("c");
  expect(jexl.evalSync('16325.62|formatInteger("0000000")')).toBe("0016325");
});

test("integers", () => {
  expect(jexl.evalSync("'16325'|toInt")).toBe(16325);
  expect(jexl.evalSync("(9/2)|toInt")).toBe(4);
});

test("booleans", () => {
  expect(jexl.evalSync("1|toBoolean")).toBe(true);
  expect(jexl.evalSync("3|toBoolean")).toBe(true);
  expect(jexl.evalSync("'1'|toBoolean")).toBe(true);
  expect(jexl.evalSync("'2'|toBoolean")).toBe(undefined);
  expect(jexl.evalSync("'a'|toBool")).toBe(undefined);
  expect(jexl.evalSync("''|toBool")).toBe(undefined);
  expect(jexl.evalSync("0|toBool")).toBe(false);
  expect(jexl.evalSync("0.0|toBool")).toBe(false);
  expect(jexl.evalSync("'false'|toBool")).toBe(false);
  expect(jexl.evalSync("'False'|toBool")).toBe(false);
  expect(jexl.evalSync("'fALSE'|toBool")).toBe(false);
  expect(jexl.evalSync("'tRUE       '|toBoolean")).toBe(true);
  expect(jexl.evalSync("'False'|toBool|not")).toBe(true);
  expect(jexl.evalSync("'TRUE'|toBool|not")).toBe(false);
});
