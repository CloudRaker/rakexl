import { expect, test } from "vitest";
import jexl from "../src";

test("convertBase64", () => {
  expect(jexl.evalSync("'foobar'|base64Encode")).toBe("Zm9vYmFy");
  expect(jexl.evalSync("'Zm9vYmFy'|base64Decode")).toBe("foobar");
  expect(jexl.evalSync("'hello⛳❤️🧀'|base64Encode|base64Decode")).toBe(
    "hello⛳❤️🧀"
  );
});

test("formUrlEncoded", () => {
  expect(jexl.evalSync('{foo:"bar",baz:"tek"}|formUrlEncoded')).toBe(
    "foo=bar&baz=tek"
  );
});

test("checksum1 - 1-char CRC-8 checksum", () => {
  const cs = jexl.evalSync("'hello'|checksum1");
  expect(typeof cs).toBe("string");
  expect(cs).toHaveLength(1);
  expect(cs).toMatch(/^[0-9A-Z]$/);
  // function form
  expect(jexl.evalSync("checksum1('hello')")).toBe(cs);
  // $-prefixed form
  expect(jexl.evalSync("$checksum1('hello')")).toBe(cs);
  // deterministic: same input → same output
  expect(jexl.evalSync("checksum1('hello')")).toBe(jexl.evalSync("checksum1('hello')"));
  // different inputs → (likely) different outputs
  expect(jexl.evalSync("checksum1('hello')")).not.toBe(jexl.evalSync("checksum1('world')"));
});

test("checksum2 - 2-char CRC-8 checksum", () => {
  const cs = jexl.evalSync("'hello'|checksum2");
  expect(typeof cs).toBe("string");
  expect(cs).toHaveLength(2);
  expect(cs).toMatch(/^[0-9A-Z]{2}$/);
  // function and $-prefixed forms
  expect(jexl.evalSync("checksum2('hello')")).toBe(cs);
  expect(jexl.evalSync("$checksum2('hello')")).toBe(cs);
  // deterministic
  expect(jexl.evalSync("checksum2('hello')")).toBe(jexl.evalSync("checksum2('hello')"));
});

test("withChecksum - appends checksum to string", () => {
  const result = jexl.evalSync("'DOC-001'|withChecksum");
  expect(typeof result).toBe("string");
  // default: 2-char checksum with "-" separator
  expect(result).toMatch(/^DOC-001-[0-9A-Z]{2}$/);
  // function and $-prefixed forms
  expect(jexl.evalSync("withChecksum('DOC-001')")).toBe(result);
  expect(jexl.evalSync("$withChecksum('DOC-001')")).toBe(result);
  // custom: 1-char checksum
  const result1 = jexl.evalSync("'DOC-001'|withChecksum(1)");
  expect(result1).toMatch(/^DOC-001-[0-9A-Z]$/);
  // custom separator
  const resultDot = jexl.evalSync("'DOC-001'|withChecksum(2, '.')");
  expect(resultDot).toMatch(/^DOC-001\.[0-9A-Z]{2}$/);
});

test("verifyChecksum - validates checksum", () => {
  // round-trip: withChecksum then verifyChecksum
  const tagged = jexl.evalSync("'CASE-2026-000184'|withChecksum");
  expect(jexl.evalSync(`'${tagged}'|verifyChecksum`)).toBe(true);
  // function and $-prefixed forms
  expect(jexl.evalSync(`verifyChecksum('${tagged}')`)).toBe(true);
  expect(jexl.evalSync(`$verifyChecksum('${tagged}')`)).toBe(true);
  // tampered string fails
  const tampered = tagged.slice(0, -1) + "X";
  expect(jexl.evalSync(`'${tampered}'|verifyChecksum`)).toBe(false);
  // 1-char round-trip
  const tagged1 = jexl.evalSync("'INV-99'|withChecksum(1)");
  expect(jexl.evalSync(`'${tagged1}'|verifyChecksum(1)`)).toBe(true);
  // custom separator round-trip
  const taggedDot = jexl.evalSync("'INV-99'|withChecksum(2, '.')");
  expect(jexl.evalSync(`'${taggedDot}'|verifyChecksum(2, '.')`)).toBe(true);
  // no separator found → false
  expect(jexl.evalSync("'noseparator'|verifyChecksum")).toBe(false);
});

test("checksum - non-string input returns undefined", () => {
  expect(jexl.evalSync("checksum1(123)")).toBeUndefined();
  expect(jexl.evalSync("checksum2(null)")).toBeUndefined();
  expect(jexl.evalSync("withChecksum(42)")).toBeUndefined();
  expect(jexl.evalSync("verifyChecksum(123)")).toBe(false);
});
