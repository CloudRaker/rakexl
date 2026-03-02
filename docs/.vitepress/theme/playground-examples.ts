export interface PlaygroundExample {
  title: string;
  expression: string;
  context: string;
}

export const examples: PlaygroundExample[] = [
  {
    title: "Filter & Map",
    expression: 'users|filter("value.active")|map("value.name")|sort()',
    context: JSON.stringify(
      {
        users: [
          { name: "Alice", age: 28, active: true, department: "Engineering" },
          { name: "Bob", age: 35, active: false, department: "Sales" },
          { name: "Charlie", age: 42, active: true, department: "Engineering" },
          { name: "Diana", age: 31, active: true, department: "Marketing" },
        ],
      },
      null,
      2,
    ),
  },
  {
    title: "Strings",
    expression:
      'users|map("uppercase(value.name) + \\" <\\" + lowercase(replace(value.name, \\" \\", \\".\\")) + \\"@acme.com>\\"" )',
    context: JSON.stringify(
      {
        users: [
          { name: "Alice Smith" },
          { name: "Bob Jones" },
          { name: "Charlie Brown" },
        ],
      },
      null,
      2,
    ),
  },
  {
    title: "Math",
    expression:
      '{ "avg": scores|average|round(1), "min": scores|min, "max": scores|max, "sum": scores|sum }',
    context: JSON.stringify(
      {
        scores: [88, 92, 75, 95, 83, 91, 67, 100],
      },
      null,
      2,
    ),
  },
  {
    title: "Objects",
    expression:
      'objectMerge(defaults, overrides)|entries|map("value.key + \\": \\" + value.value")|join(", ")',
    context: JSON.stringify(
      {
        defaults: { theme: "light", lang: "en", pageSize: 25 },
        overrides: { theme: "dark", pageSize: 50 },
      },
      null,
      2,
    ),
  },
  {
    title: "Date & Time",
    expression:
      '{ "now": now()|dateTimeFormat("yyyy-MM-dd HH:mm"), "weekday": now()|dateTimeFormat("EEEE"), "epoch": now()|dateTimeToMillis }',
    context: JSON.stringify({}, null, 2),
  },
  {
    title: "Type Conversion",
    expression:
      '{ "num": toNumber("42.5"), "bool": toBoolean(1), "json": json(data), "type": type(data) }',
    context: JSON.stringify(
      {
        data: [1, "two", true, null],
      },
      null,
      2,
    ),
  },
];
