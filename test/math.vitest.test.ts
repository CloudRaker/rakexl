import { expect, test } from "vitest";
import jexl from "../src";

test("number", () => {
  expect(jexl.evalSync('$number("1")')).toBe(1);
  expect(jexl.evalSync('$number("1.1")')).toBe(1.1);
  expect(jexl.evalSync('$number("-1.1")')).toBe(-1.1);
  expect(jexl.evalSync("$number(-1.1)")).toBe(-1.1);
  expect(jexl.evalSync("$number(-1.1)|floor")).toBe(-2);
  expect(jexl.evalSync('$number("10.6")|ceil')).toBe(11);
  expect(jexl.evalSync("10.123456|round(2)")).toBe(10.12);
  expect(jexl.evalSync("10.123456|toInt")).toBe(10);
  expect(jexl.evalSync('"10.123456"|toInt')).toBe(10);
  expect(jexl.evalSync("3|power(2)")).toBe(9);
  expect(jexl.evalSync("3|power")).toBe(9);
  expect(jexl.evalSync("9|sqrt")).toBe(3);
  expect(jexl.evalSync("random() < 1")).toBe(true);
});

test("numericAggregations", () => {
  expect(jexl.evalSync("[1,2,3]|sum")).toBe(6);
  expect(jexl.evalSync("sum(1,2,3,4,5)")).toBe(15);
  expect(jexl.evalSync("[1,3]|sum(1,2,3,4,5)")).toBe(19);
  expect(jexl.evalSync("[1,3]|sum([1,2,3,4,5])")).toBe(19);
  expect(jexl.evalSync("[1,3]|max([1,2,3,4,5])")).toBe(5);
  expect(jexl.evalSync("[2,3]|min([1,2,3,4,5])")).toBe(1);
  expect(jexl.evalSync("[4,5,6]|avg")).toBe(5);
});
