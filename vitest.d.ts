/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  type Assertion<T = unknown> = TestingLibraryMatchers<T, void>;
  type AsymmetricMatchersContaining = TestingLibraryMatchers<unknown, void>;
}
