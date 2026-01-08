# Testing

This document describes the test setup and patterns used in the blog application.

> **Source of truth:** `bunfig.toml`, `test/`, component `*.test.tsx` files

## Overview

Tests use:

- **Bun's native test runner** - Fast, built-in test execution
- **happy-dom** - Lightweight DOM implementation
- **@testing-library/react** - Component testing utilities
- **@testing-library/jest-dom** - Custom matchers

## Configuration

### bunfig.toml

```toml
[test]
preload = [
  "./test/css-modules.ts",
  "./test/happydom.ts",
  "./test/setup.ts",
]
```

Preload files run before each test file.

## Preload Files

### test/css-modules.ts

Enables CSS Modules in tests:

```typescript
import "bun-css-modules";
```

Without this, CSS Module imports would fail in the test environment.

### test/happydom.ts

Registers happy-dom as the global DOM:

```typescript
import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();
```

Provides `window`, `document`, and other browser globals.

### test/setup.ts

Sets up testing utilities and mocks:

1. **Testing Library matchers**:
   ```typescript
   import "@testing-library/jest-dom/vitest";
   ```

2. **Module mocks** for Next.js and related packages

3. **Browser API stubs** like `matchMedia`

## Module Mocks

### server-only

Mocked to no-op (prevents server-only import errors):

```typescript
mock.module("server-only", () => ({}));
```

### next/link

Mocked to render a simple `<a>` tag:

```typescript
mock.module("next/link", () => ({
  default: ({ href, children }) => <a href={href}>{children}</a>,
}));
```

### next/image and next-image-export-optimizer

Mocked to render a simple `<img>` tag:

```typescript
mock.module("next/image", () => ({
  default: (props) => <img {...props} />,
}));

mock.module("next-image-export-optimizer", () => ({
  default: (props) => <img {...props} />,
}));
```

### window.matchMedia

Stubbed for theme detection:

```typescript
window.matchMedia = () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
  // ...
});
```

## Test File Structure

Tests are co-located with source files:

```
src/components/footer/
├── footer.tsx
├── footer.module.css
└── footer.test.tsx
```

### Naming Convention

- `*.test.ts` - Unit tests for utilities
- `*.test.tsx` - Component tests (JSX)

## Writing Tests

### Basic Component Test

```typescript
import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MyComponent } from "./my-component";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Testing with User Events

```typescript
import userEvent from "@testing-library/user-event";

it("handles click", async () => {
  const user = userEvent.setup();
  render(<Button onClick={handleClick} />);
  
  await user.click(screen.getByRole("button"));
  expect(handleClick).toHaveBeenCalled();
});
```

### Testing Async Components

```typescript
it("loads data", async () => {
  render(<AsyncComponent />);
  
  await screen.findByText("Loaded");
  expect(screen.getByText("Loaded")).toBeInTheDocument();
});
```

## Running Tests

### Development (Watch Mode)

```bash
bun test
```

Watches for file changes and re-runs affected tests.

### CI Mode

```bash
bun test:ci
```

Runs all tests once and exits.

### Coverage

```bash
bun test:coverage
```

Generates a coverage report.

## Test Locations

| Area | Location |
|------|----------|
| Components | `src/components/**/*.test.tsx` |
| Data layer | `src/data/posts/*.test.ts` |
| Utilities | `src/lib/*.test.ts` |

## Best Practices

### Query Priority

Use queries in this order (most accessible first):

1. `getByRole` - Accessible name
2. `getByLabelText` - Form fields
3. `getByText` - Text content
4. `getByTestId` - Last resort

### Avoid Implementation Details

Test behavior, not implementation:

```typescript
// Good - tests behavior
expect(screen.getByText("Submit")).toBeEnabled();

// Avoid - tests implementation
expect(component.state.isEnabled).toBe(true);
```

### Async Handling

Use `findBy*` queries for async content:

```typescript
// Good - waits for element
const element = await screen.findByText("Loaded");

// Avoid - may race condition
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument();
});
```

## Troubleshooting

### "Cannot find module 'server-only'"

Ensure `test/setup.ts` mocks the module before tests run.

### CSS Module Errors

Ensure `test/css-modules.ts` is in the preload list.

### Missing DOM Globals

Ensure `test/happydom.ts` is in the preload list.

### Theme-Related Failures

The `matchMedia` mock defaults to light theme. Override if testing dark theme:

```typescript
window.matchMedia = () => ({
  matches: true, // dark theme
  // ...
});
```
