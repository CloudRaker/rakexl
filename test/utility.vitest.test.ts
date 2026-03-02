import { expect, test } from "vitest";
import jexl from "../src";

test("length", () => {
  expect(jexl.evalSync("'test123'|length")).toBe(7);
  expect(jexl.evalSync('["a",1,"b"]|length')).toBe(3);
  expect(jexl.evalSync('$length(["a",1,"b"])')).toBe(3);
  expect(jexl.evalSync("{a:1,b:2,c:3}|length")).toBe(3);
});

test("case", () => {
  expect(jexl.evalSync('2|case(1,"a",2,"b",3,"c")')).toBe("b");
  expect(jexl.evalSync('$case("bar","foo","a","bar","b","baz","c")')).toBe("b");
  expect(
    jexl.evalSync(
      "'notfound'|case('bar','foo','a','bar','b','baz','c','b','b')"
    )
  ).toBe("b");
});

test("eval", () => {
  const context = {
    assoc: [
      { lastName: "Archer", age: 32 },
      { lastName: "Poovey", age: 34 },
      { lastName: "Figgis", age: 45 },
    ],
    expression: "age",
  };
  expect(jexl.evalSync("eval(1+2)")).toBe(3);
  expect(jexl.evalSync("assoc[0]|eval('age')", context)).toBe(32);
  expect(jexl.evalSync("assoc[2]|eval(expression)", context)).toBe(45);
});

test("typeCheck", () => {
  expect(jexl.evalSync("5|type")).toBe("number");
  expect(jexl.evalSync("'5'|type")).toBe("string");
  expect(jexl.evalSync("true|type")).toBe("boolean");
  // expect(jexl.evalSync("null|type")).toBe("null");
  expect(jexl.evalSync("[1,2,3]|type")).toBe("array");
  expect(jexl.evalSync("{foo:1}|type")).toBe("object");
  expect(jexl.evalSync("undefined|type")).toBe("undefined");
});
