# Extendable expect

An extendable version of the typical `expect` test API, inspired by [Playwright fixtures](https://playwright.dev/docs/test-fixtures).

```ts
const numberMatchers = {
  doubledToBe(value: number, expected: number) {
    expect(value * 2).toEqual(expected)
  },
}

const expectNumber = expect.extend(numberMatchers)

// Autocompletes with types
expectNumber(4 + 1).doubledToBe(10)
```

There are a few base matchers that come out of the box, but they're pretty minimal:

```ts
{
  // Booleans
  toBeTruthy: () => void;
  toBeFalsy: () => void;

  // Numbers
  toBeGreaterThan: (expected: number) => void
  toBeGreaterThanOrEqual: (expected: number) => void
  toBeLessThan: (expected: number) => void
  toBeLessThanOrEqual: (expected: number) => void

  // Promises
  toAwaitToEqual: (expected: unknown) => Promise<void>;

  // Arrays
  toHaveUniqueValues: () => void;
  toContain: (valueToTest: unknown) => void;
  toHaveLength: (expectedLength: number) => void;

  // Other
  toReferenceEqual: (expected: number) => void
  toEqual: (expected: number) => void
  toShallowEqual: (expected: number) => void
  toBeTruthy: () => void
  toBeFalsy: () => void
}
```

## TODO
- [ ] Better types for promises and arrays
- [ ] Plain object matchers
