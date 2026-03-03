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

test("roundTo", () => {
  // Round to nearest 5
  expect(jexl.evalSync("14|roundTo(5)")).toBe(15);
  expect(jexl.evalSync("22|roundTo(5)")).toBe(20);
  expect(jexl.evalSync("13|roundTo(5)")).toBe(15);
  expect(jexl.evalSync("12|roundTo(5)")).toBe(10);
  // Round to nearest 10
  expect(jexl.evalSync("14|roundTo(10)")).toBe(10);
  expect(jexl.evalSync("25|roundTo(10)")).toBe(30);
  // Function and $-prefix forms
  expect(jexl.evalSync("roundTo(14, 5)")).toBe(15);
  expect(jexl.evalSync("$roundTo(22, 5)")).toBe(20);
  // Negative numbers
  expect(jexl.evalSync("(-14)|roundTo(5)")).toBe(-15);
  expect(jexl.evalSync("(-12)|roundTo(5)")).toBe(-10);
  // Decimal step
  expect(jexl.evalSync("0.7|roundTo(0.25)")).toBe(0.75);
  expect(jexl.evalSync("0.3|roundTo(0.25)")).toBe(0.25);
});

test("floorTo", () => {
  // Floor to nearest 5
  expect(jexl.evalSync("14|floorTo(5)")).toBe(10);
  expect(jexl.evalSync("22|floorTo(5)")).toBe(20);
  expect(jexl.evalSync("15|floorTo(5)")).toBe(15);
  // Floor to nearest 10
  expect(jexl.evalSync("27|floorTo(10)")).toBe(20);
  // Function and $-prefix forms
  expect(jexl.evalSync("floorTo(14, 5)")).toBe(10);
  expect(jexl.evalSync("$floorTo(22, 5)")).toBe(20);
  // Negative numbers
  expect(jexl.evalSync("(-12)|floorTo(5)")).toBe(-15);
  expect(jexl.evalSync("(-10)|floorTo(5)")).toBe(-10);
  // Decimal step
  expect(jexl.evalSync("0.7|floorTo(0.25)")).toBe(0.5);
});

test("ceilTo", () => {
  // Ceil to nearest 5
  expect(jexl.evalSync("14|ceilTo(5)")).toBe(15);
  expect(jexl.evalSync("22|ceilTo(5)")).toBe(25);
  expect(jexl.evalSync("20|ceilTo(5)")).toBe(20);
  // Ceil to nearest 10
  expect(jexl.evalSync("21|ceilTo(10)")).toBe(30);
  // Function and $-prefix forms
  expect(jexl.evalSync("ceilTo(14, 5)")).toBe(15);
  expect(jexl.evalSync("$ceilTo(22, 5)")).toBe(25);
  // Negative numbers
  expect(jexl.evalSync("(-12)|ceilTo(5)")).toBe(-10);
  expect(jexl.evalSync("(-15)|ceilTo(5)")).toBe(-15);
  // Decimal step
  expect(jexl.evalSync("0.3|ceilTo(0.25)")).toBe(0.5);
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
