import { expect, test } from "vitest";
import jexl from "../src";

import jexl2 from "jexl";
import { arrayMap } from "../src/grammar";

test("importSeparate", () => {
  jexl2.addTransform("map", arrayMap);
  expect(jexl2.evalSync('[1,2,3]|map("value+1")')).toEqual([2, 3, 4]);
});

test("complexTest1", () => {
  const context = {
    properties: [
      {
        attributeName: "osm_id",
        displayName: "osm_id",
        displayValue: 96188601,
      },
      {
        attributeName: "is_node",
        displayName: "is_node",
        displayValue: false,
      },
      {
        attributeName: "area",
        displayName: "area",
        displayValue: 21735,
      },
      {
        attributeName: "name",
        displayName: "name",
        displayValue: "San Giacomo 220",
      },
      {
        attributeName: "voltage",
        displayName: "voltage",
        displayValue: "220.0000000000000000",
      },
      {
        attributeName: "construction",
        displayName: "construction",
        displayValue: false,
      },
      {
        attributeName: "substation",
        displayName: "substation",
        displayValue: "transmission",
      },
    ],
  };
  expect(
    jexl.evalSync(`properties[.attributeName == 'voltage_2']|length`, context)
  ).toBeFalsy();
  expect(
    jexl.evalSync(
      `properties[.attributeName == 'voltage_2']|length > 0 ? ('; ' + properties[.attributeName == 'voltage_2'].displayValue|split('.')[0]) : ''`,
      context
    )
  ).toBe("");
  expect(
    jexl.evalSync(
      `properties[.attributeName=='voltage'].displayValue|split('.')[0] +
    (properties[.attributeName == 'voltage_2']|length > 0 ? ('; ' + properties[.attributeName == 'voltage_2'].displayValue|split('.')[0]) : '') +
    (properties[.attributeName == 'voltage_3']|length > 0 ? ('; ' + properties[.attributeName == 'voltage_3'].displayValue|split('.')[0]) : '')`,
      context
    )
  ).toBe("220");
});
