import { expect, test } from "vitest";
import jexl from "../src";

test("objects", () => {
  const expected = { foo: "bar", baz: "tek" };
  expect(jexl.evalSync("$merge({foo:'bar'},{baz:'tek'})")).toEqual(expected);
  expect(jexl.evalSync('{foo:"bar"}|merge({baz:"tek"})')).toEqual(expected);
  expect(jexl.evalSync('[{foo:"bar"},{baz:"tek"}]|merge')).toEqual(expected);
  expect(jexl.evalSync('[{foo:"bar"}]|merge([{baz:"tek"}])')).toEqual(expected);
  expect(jexl.evalSync('[["foo","bar"],["baz","tek"]]|toObject')).toEqual(
    expected
  );
  expect(jexl.evalSync('["foo","bar"]|toObject(true)')).toEqual({
    foo: true,
    bar: true,
  });
  expect(jexl.evalSync('["a","b","c"]|toObject(true)')).toEqual({
    a: true,
    b: true,
    c: true,
  });
  expect(jexl.evalSync('\'{"foo":"bar"}\'|toJson')).toEqual({ foo: "bar" });
});
