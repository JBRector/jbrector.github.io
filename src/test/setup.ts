import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
// vitest-axe@0.1.0 has two problems that block it working out of the box with
// this project's vitest 4:
//  1. 'vitest-axe/extend-expect' ships an empty runtime file (verified against
//     the published npm tarball), so it registers no matcher; its ambient
//     types also target the pre-4 `Vi` namespace, which vitest 4 no longer
//     reads.
//  2. its sibling entrypoint 'vitest-axe/matchers' re-exports type-only
//     (`export type *`), stripping `toHaveNoViolations` of its value even
//     though the compiled JS is a real function.
// Work around both by importing the runtime value straight from dist and
// registering it manually, then re-declaring the matcher type against
// vitest 4's `Assertion` interface the way `@testing-library/jest-dom/vitest`
// already does in this project.
import { toHaveNoViolations, type AxeMatchers } from 'vitest-axe/dist/matchers';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any -- must mirror vitest's own `Assertion<T = any>` signature exactly for declaration merging
  interface Assertion<T = any> extends AxeMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration-merging pattern, matches @testing-library/jest-dom/vitest's own type augmentation
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

expect.extend({ toHaveNoViolations });

afterEach(() => {
  cleanup();
});
