import { expect, test } from "vitest";
import jexl from "../src";

test("join", () => {
  expect(jexl.evalSync('join(["foo", "bar"], "-")')).toBe("foo-bar");
  expect(jexl.evalSync('join(["foo", "bar"], "")')).toBe("foobar");
  expect(jexl.evalSync('"f,b,a,d,e,c"|split(",")|sort|join')).toEqual(
    "a,b,c,d,e,f"
  );
  expect(jexl.evalSync('"f,b,a,d,e,c"|split(",")|sort|join("")')).toEqual(
    "abcdef"
  );
});

test("arrays", () => {
  expect(jexl.evalSync('["foo", "bar", "baz"]|append("tek")')).toEqual([
    "foo",
    "bar",
    "baz",
    "tek",
  ]);
  expect(jexl.evalSync('["foo", "bar"]|append(["baz","tek"])')).toEqual([
    "foo",
    "bar",
    "baz",
    "tek",
  ]);
  expect(jexl.evalSync('"foo"|append(["bar", "baz","tek"])')).toEqual([
    "foo",
    "bar",
    "baz",
    "tek",
  ]);
  expect(jexl.evalSync('"foo"|append("bar", "baz","tek")')).toEqual([
    "foo",
    "bar",
    "baz",
    "tek",
  ]);
  expect(jexl.evalSync('["tek", "baz", "bar", "foo"]|reverse')).toEqual([
    "foo",
    "bar",
    "baz",
    "tek",
  ]);
  expect(
    jexl.evalSync('["tek", "baz", "bar", "foo", "foo"]|reverse|distinct')
  ).toEqual(["foo", "bar", "baz", "tek"]);
  expect(jexl.evalSync("{foo:0, bar:1, baz:2, tek:3}|keys")).toEqual([
    "foo",
    "bar",
    "baz",
    "tek",
  ]);
  expect(jexl.evalSync('{a:"foo", b:"bar", c:"baz", d:"tek"}|values')).toEqual([
    "foo",
    "bar",
    "baz",
    "tek",
  ]);
  expect(
    jexl.evalSync(
      '[{name:"foo"}, {name:"bar"}, {name:"baz"}, {name:"tek"}]|mapField("name")'
    )
  ).toEqual(["foo", "bar", "baz", "tek"]);
  expect(
    jexl.evalSync(
      '[{name:"tek",age:32}, {name:"bar",age:34}, {name:"baz",age:33}, {name:"foo",age:35}]|sort("age",true)|mapField("name")'
    )
  ).toEqual(["tek", "baz", "bar", "foo"]);
  expect(jexl.evalSync('["foo"]|append(["tek","baz","bar"]|sort)')).toEqual([
    "foo",
    "bar",
    "baz",
    "tek",
  ]);
  expect(
    jexl.evalSync(
      '["foo"]|append(["tek", "baz", "bar", "foo", "foo"]|filter("value != \'foo\'")|sort)'
    )
  ).toEqual(["foo", "bar", "baz", "tek"]);
});

test("map", () => {
  const context = {
    assoc: [
      { lastName: "Archer", age: 32 },
      { lastName: "Poovey", age: 34 },
      { lastName: "Figgis", age: 45 },
    ],
  };
  expect(
    jexl.evalSync(
      '[{name:"foo"}, {name:"bar"}, {name:"baz"}, {name:"tek"}]|map("value.name")'
    )
  ).toEqual(["foo", "bar", "baz", "tek"]);
  expect(
    jexl.evalSync(
      '[{name:"tek",age:32}, {name:"bar",age:34}, {name:"baz",age:33}, {name:"foo",age:35}]|map("value.age")'
    )
  ).toEqual([32, 34, 33, 35]);
  expect(jexl.evalSync("assoc|map('value.age')", context)).toEqual([
    32, 34, 45,
  ]);
  expect(jexl.evalSync("assoc|map('value.lastName')", context)).toEqual([
    "Archer",
    "Poovey",
    "Figgis",
  ]);
  expect(jexl.evalSync("assoc|map('value.age + index')", context)).toEqual([
    32, 35, 47,
  ]);
  expect(
    jexl.evalSync(
      "assoc|map('value.age + array[.age <= value.age][0].age + index')",
      context
    )
  ).toEqual([64, 67, 79]);
  expect(jexl.evalSync("assoc|map('value.age')|avg", context)).toBe(37);
});

test("anyAll", () => {
  const context = {
    assoc: [
      { lastName: "Archer", age: 32 },
      { lastName: "Poovey", age: 34 },
      { lastName: "Figgis", age: 45 },
    ],
  };
  expect(
    jexl.evalSync(
      '[{name:"foo"}, {name:"bar"}, {name:"baz"}, {name:"tek"}]|any("value.name==\'foo\'")'
    )
  ).toBe(true);
  expect(jexl.evalSync('assoc|every("value.age>30")', context)).toBe(true);
  expect(jexl.evalSync('assoc|every("value.age>40")', context)).toBe(false);
  expect(jexl.evalSync('assoc|some("value.age>40")', context)).toBe(true);
  expect(
    jexl.evalSync("assoc|some(\"value.lastName=='Figgis'\")", context)
  ).toBe(true);
  expect(
    jexl.evalSync('assoc|map("value.age")|some("value>30")', context)
  ).toBe(true);
});

test("reduce", () => {
  const context = {
    assoc: [
      { lastName: "Archer", age: 32 },
      { lastName: "Poovey", age: 34 },
      { lastName: "Figgis", age: 45 },
    ],
  };
  expect(
    jexl.evalSync("assoc|reduce('accumulator + value.age', 0)", context)
  ).toBe(111);
  expect(
    jexl.evalSync(
      "assoc|reduce('(value.age > array|map(\\'value.age\\')|avg) ? accumulator|append(value.age) : accumulator', [])",
      context
    )
  ).toEqual([45]);
  expect(
    jexl.evalSync(
      "assoc|reduce('(value.age < array|map(\\'value.age\\')|avg) ? accumulator|append(value.age) : accumulator', [])[1]",
      context
    )
  ).toBe(34);
});
