import { describe, expect, it } from "vitest";
import { STYLELINT_SEVERITY } from "./constants";
import { filterResults, shouldIgnoreModule } from "./linter";
import type { StylelintLinterResult, StylelintPluginOptions } from "./types";

describe("shouldIgnoreModule", () => {
  const include = () => true;
  const exclude = () => false;

  it("ignores virtual modules", () => {
    // null-byte prefixed (\0-prefixed) modules
    expect(shouldIgnoreModule("\0virtual:foo", include)).toBe(true);
    // virtual: scheme
    expect(shouldIgnoreModule("virtual:foo", include)).toBe(true);
    // no slash (e.g. bare names resolved as virtual)
    expect(shouldIgnoreModule("bare-id", include)).toBe(true);
  });

  it("ignores paths excluded by the filter", () => {
    expect(shouldIgnoreModule("/src/foo.css", exclude)).toBe(true);
  });

  it("keeps .vue/.svelte ?type=style submodules (stylelint lints style blocks)", () => {
    // NOTE: opposite of the ESLint plugin — stylelint wants to lint these.
    expect(shouldIgnoreModule("/src/App.vue?type=style", include)).toBe(false);
    expect(shouldIgnoreModule("/src/Comp.svelte?type=style", include)).toBe(
      false,
    );
  });

  it("ignores .vue/.svelte modules without a ?type=style query", () => {
    expect(shouldIgnoreModule("/src/App.vue", include)).toBe(true);
    expect(shouldIgnoreModule("/src/Comp.svelte", include)).toBe(true);
  });

  it("does not ignore normal .css files", () => {
    expect(shouldIgnoreModule("/src/foo.css", include)).toBe(false);
  });
});

const baseOptions: Pick<
  StylelintPluginOptions,
  "emitError" | "emitWarning" | "emitErrorAsWarning" | "emitWarningAsError"
> = {
  emitError: true,
  emitWarning: true,
  emitErrorAsWarning: false,
  emitWarningAsError: false,
};

// Minimal Warning with the fields filterResults inspects.
const errorWarning = {
  severity: STYLELINT_SEVERITY.ERROR,
  text: "e",
  line: 1,
  column: 1,
  rule: "test/no-error",
} as StylelintLinterResult["results"][number]["warnings"][number];
const warningWarning = {
  severity: STYLELINT_SEVERITY.WARNING,
  text: "w",
  line: 1,
  column: 1,
  rule: "test/no-warn",
} as StylelintLinterResult["results"][number]["warnings"][number];

const makeResult = (
  overrides: Partial<StylelintLinterResult["results"][number]> = {},
) =>
  ({
    source: "/src/foo.css",
    deprecations: [],
    invalidOptionWarnings: [],
    parseErrors: [],
    warnings: [],
    ...overrides,
  }) as StylelintLinterResult["results"][number];

const makeLinterResult = (
  results: StylelintLinterResult["results"],
  errored = false,
) =>
  ({
    cwd: "/",
    results,
    errored,
    report: "",
  }) as StylelintLinterResult;

describe("filterResults", () => {
  it("drops ignored results", () => {
    const linterResult = makeLinterResult([
      makeResult({ ignored: true, warnings: [errorWarning] }),
    ]);
    const { results } = filterResults(linterResult, {
      ...baseOptions,
    } as StylelintPluginOptions);
    expect(results).toHaveLength(0);
  });

  it("filters out error warnings when emitError is false", () => {
    const linterResult = makeLinterResult([
      makeResult({ warnings: [errorWarning] }),
    ]);
    const { results } = filterResults(linterResult, {
      ...baseOptions,
      emitError: false,
    } as StylelintPluginOptions);
    // removing the only warning leaves warnings empty, so the result is dropped
    expect(results).toHaveLength(0);
  });

  it("filters out warning warnings when emitWarning is false", () => {
    const linterResult = makeLinterResult([
      makeResult({ warnings: [warningWarning] }),
    ]);
    const { results } = filterResults(linterResult, {
      ...baseOptions,
      emitWarning: false,
    } as StylelintPluginOptions);
    expect(results).toHaveLength(0);
  });

  it("returns textType 'error' when errored", () => {
    const linterResult = makeLinterResult(
      [makeResult({ warnings: [errorWarning] })],
      true,
    );
    const { textType } = filterResults(
      linterResult,
      baseOptions as StylelintPluginOptions,
    );
    expect(textType).toBe("error");
  });

  it("returns textType 'warning' when emitErrorAsWarning flips errored results", () => {
    const linterResult = makeLinterResult(
      [makeResult({ warnings: [errorWarning] })],
      true,
    );
    const { textType } = filterResults(linterResult, {
      ...baseOptions,
      emitErrorAsWarning: true,
    } as StylelintPluginOptions);
    expect(textType).toBe("warning");
  });

  it("returns textType 'warning' for warning-only results", () => {
    const linterResult = makeLinterResult([
      makeResult({ warnings: [warningWarning] }),
    ]);
    const { textType } = filterResults(
      linterResult,
      baseOptions as StylelintPluginOptions,
    );
    expect(textType).toBe("warning");
  });

  it("returns textType 'error' when emitWarningAsError flips warning results", () => {
    const linterResult = makeLinterResult([
      makeResult({ warnings: [warningWarning] }),
    ]);
    const { textType } = filterResults(linterResult, {
      ...baseOptions,
      emitWarningAsError: true,
    } as StylelintPluginOptions);
    expect(textType).toBe("error");
  });
});
