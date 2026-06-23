import { describe, expect, it } from "vitest";
import { STYLELINT_SEVERITY } from "./constants";
import {
  buildOverlayPayload,
  filterResults,
  OverlayManager,
  shouldIgnoreModule,
} from "./linter";
import type {
  OverlayPayload,
  StylelintLinterResult,
  StylelintPluginOptions,
} from "./types";

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

describe("buildOverlayPayload", () => {
  it("maps warning severity from the post-filter textType", () => {
    const linterResult = makeLinterResult(
      [makeResult({ source: "/src/a.css", warnings: [warningWarning] })],
      false,
    );
    const { results, textType } = filterResults(
      linterResult,
      baseOptions as StylelintPluginOptions,
    );
    const payload = buildOverlayPayload(results, textType);
    expect(textType).toBe("warning");
    expect(payload.results[0].messages[0].severity).toBe("warning");
  });

  it("reflects emitErrorAsWarning as 'warning' severity in the payload", () => {
    const linterResult = makeLinterResult(
      [makeResult({ source: "/src/a.css", warnings: [errorWarning] })],
      true,
    );
    // filterResults derives the post-filter textType; buildOverlayPayload honors it.
    const { results, textType } = filterResults(linterResult, {
      ...baseOptions,
      emitErrorAsWarning: true,
    } as StylelintPluginOptions);
    const payload = buildOverlayPayload(results, textType);
    expect(textType).toBe("warning");
    expect(payload.results[0].messages[0].severity).toBe("warning");
  });

  it("preserves source as filePath, and rule/text/line/column on each message", () => {
    const customWarning = {
      severity: STYLELINT_SEVERITY.ERROR,
      text: "Expected no errors",
      line: 12,
      column: 3,
      rule: "test/no-error",
    } as StylelintLinterResult["results"][number]["warnings"][number];
    const linterResult = makeLinterResult(
      [makeResult({ source: "/src/a.css", warnings: [customWarning] })],
      true,
    );
    const { results, textType } = filterResults(
      linterResult,
      baseOptions as StylelintPluginOptions,
    );
    const payload = buildOverlayPayload(results, textType);
    const msg = payload.results[0].messages[0];
    expect(msg).toMatchObject({
      line: 12,
      column: 3,
      severity: "error",
      ruleId: "test/no-error",
      message: "Expected no errors",
    });
    expect(payload.results[0].filePath).toBe("/src/a.css");
  });
});

describe("OverlayManager", () => {
  it("accumulates results across files", () => {
    const mgr = new OverlayManager();
    const first = mgr.upsert({
      results: [
        {
          filePath: "/src/a.css",
          messages: [
            {
              line: 1,
              column: 1,
              severity: "error",
              ruleId: "x",
              message: "e",
            },
          ],
        },
      ],
    });
    expect(first?.results).toHaveLength(1);
    const second = mgr.upsert({
      results: [
        {
          filePath: "/src/b.css",
          messages: [
            {
              line: 2,
              column: 1,
              severity: "warning",
              ruleId: "y",
              message: "w",
            },
          ],
        },
      ],
    });
    expect(second?.results).toHaveLength(2);
  });

  it("replaces a file's entry on re-lint", () => {
    const mgr = new OverlayManager();
    mgr.upsert({
      results: [
        {
          filePath: "/src/a.css",
          messages: [
            {
              line: 1,
              column: 1,
              severity: "error",
              ruleId: "x",
              message: "e",
            },
          ],
        },
      ],
    });
    const updated = mgr.upsert({
      results: [
        {
          filePath: "/src/a.css",
          messages: [
            {
              line: 5,
              column: 2,
              severity: "error",
              ruleId: "z",
              message: "new",
            },
          ],
        },
      ],
    });
    expect(updated?.results).toHaveLength(1);
    expect(updated?.results[0].messages[0].message).toBe("new");
  });

  it("drops a file when its messages become empty and returns undefined when all clear", () => {
    const mgr = new OverlayManager();
    mgr.upsert({
      results: [
        {
          filePath: "/src/a.css",
          messages: [
            {
              line: 1,
              column: 1,
              severity: "error",
              ruleId: "x",
              message: "e",
            },
          ],
        },
      ],
    });
    const cleared = mgr.upsert({
      results: [{ filePath: "/src/a.css", messages: [] }],
    });
    expect(cleared).toBeUndefined();
  });

  it("snapshot returns undefined when empty", () => {
    const mgr = new OverlayManager();
    expect(mgr.snapshot()).toBeUndefined();
  });

  it("snapshot returns the accumulated payload", () => {
    const mgr = new OverlayManager();
    mgr.upsert({
      results: [
        {
          filePath: "/src/a.css",
          messages: [
            {
              line: 1,
              column: 1,
              severity: "error",
              ruleId: "x",
              message: "e",
            },
          ],
        },
      ],
    });
    const snap = mgr.snapshot() as OverlayPayload;
    expect(snap.results).toHaveLength(1);
  });
});
