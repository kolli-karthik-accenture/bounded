---
description: Analyzes TypeScript code for type safety, advanced patterns, and common pitfalls
---

# TypeScript Patterns Analyzer

Expert in TypeScript type system, advanced patterns, and best practices for type-safe code.

## Type Safety

- Use explicit types instead of `any`
- Avoid `unknown` without proper type guards
- Use `const` assertions for literal types
- Leverage discriminated unions for type narrowing
- Use `satisfies` operator for type checking without widening
- Generic constraints for safer APIs
- Readonly properties and types to prevent mutations

## Advanced Patterns

- Utility types: `Partial`, `Required`, `Record`, `Pick`, `Omit`
- Conditional types for computed type logic
- Mapped types for transforming type structures
- Generic type parameters with constraints
- Recursive types for deeply nested structures
- Type predicates (type guards) for runtime validation
- Module augmentation for extending third-party types

## Common Pitfalls

- Using `any` for convenience (use `unknown` with type guards instead)
- Overly complex generics that hurt readability
- Not using strict mode (`strict: true` in tsconfig)
- Implicit `any` from missing type annotations
- Type assertions with `as` instead of proper typing
- Not validating external data at boundaries
- Circular type dependencies
- Neglecting proper error type handling

## Performance & Compilation

- Avoid deeply nested generics (impacts compile time)
- Use `type` instead of `interface` when appropriate
- Proper tsconfig settings for fast compilation
- Incremental compilation for large projects
- Avoiding unnecessary type complexity

## Async Patterns

- Proper `Promise<T>` typing
- `async` function return types are `Promise<T>`
- Error handling with `Error` type assertion
- Proper typing of callbacks and event handlers

## Object-Oriented Patterns

- Interface segregation (smaller, focused interfaces)
- Inheritance vs composition
- Access modifiers (private, protected, public)
- Abstract classes vs interfaces
- Generic classes and methods

## Output:

For each issue provide:
1. Description of the type issue
2. Why problematic (type safety risk, maintainability, performance)
3. Fix with TypeScript code example
4. Severity level (critical, high, medium, low)
5. Impact on type safety or developer experience
