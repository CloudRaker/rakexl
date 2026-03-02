---
title: Rakexl Documentation
description: Complete guide to the Rakexl expression language
---

Welcome to Rakexl, an opinionated extended grammar for the JEXL expression parser and evaluator with 80+ built-in functions.

## Quick Example

```javascript
import jexl from 'rakexl';
const result = jexl.evalSync('user.name | uppercase', { user: { name: 'John' } });
// "JOHN"
```

## Language Guide

### 📖 [Language Reference](./language/)
- [Syntax Overview](./language/syntax) - Basic JEXL syntax rules
- [Data Types](./language/data-types) - Strings, numbers, arrays, objects
- [Operators](./language/operators) - Arithmetic, comparison, logical operators
- [Expressions](./language/expressions) - Complex expression patterns
- [Context and Variables](./language/context) - Working with data context

### � [Function Reference](./reference/)
Complete documentation for all 80+ functions:
- [Array Functions](./reference/array/) - Collection processing
- [String Functions](./reference/string/) - Text manipulation
- [Math Functions](./reference/math/) - Numerical operations
- [Date/Time Functions](./reference/datetime/) - Date handling
- [Utility Functions](./reference/utility/) - Helpers and conversions

## Usage Guides

### [JavaScript/TypeScript](./usage/javascript)
- Installation with npm/yarn
- Basic usage and integration patterns
- Monaco Editor setup with IntelliSense
- TypeScript support and type definitions
- Performance optimization techniques

## Interactive Playground

Try Rakexl expressions online with our interactive playground:

### [Launch Playground →](https://konnektr-io.github.io/jexl-playground/)

The playground features:
- **Live Expression Editor** - Monaco Editor with syntax highlighting and IntelliSense
- **Real-time Evaluation** - See results as you type
- **Sample Data** - Pre-loaded with example contexts
- **Save & Share** - Save your expressions for later
- **Examples Library** - Learn from practical examples

📖 [Playground Guide](./playground) - Learn how to use all playground features

## Key Features

- **🚀 80+ Built-in Functions** - String manipulation, math, arrays, objects, dates, and more
- **🎨 Monaco Editor Support** - Syntax highlighting, IntelliSense, and hover documentation  
- **📝 TypeScript Support** - Full type definitions included
- **🔧 Modular** - Use the entire library or import individual functions

## Examples

### Data Transformation
```javascript
// Transform an array of users
const users = [
  { name: "Alice", age: 28, department: "Engineering" },
  { name: "Bob", age: 32, department: "Marketing" },
  { name: "Charlie", age: 24, department: "Engineering" }
];

// Get names of engineers older than 25
jexl.evalSync('users|filter("value.department == \\"Engineering\\" && value.age > 25")|map("value.name")', { users });
// ["Alice"]
```

### String Processing
```javascript
// Process and format text
jexl.evalSync('"hello world" | uppercase | split(" ") | join("-")');
// "HELLO-WORLD"
```

### Mathematical Operations
```javascript
// Calculate statistics
jexl.evalSync('numbers | sum / length(numbers)', { numbers: [1, 2, 3, 4, 5] });
// 3 (average)
```

## Contributing

Rakexl is open source. Contributions are welcome! Please see our GitHub repository for more information.

## License

MIT License - see LICENSE file for details.