import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createLinter } from "./linter";
import { getOptions } from "./utils";

// Runs against the real Stylelint installed in this workspace, so a breaking
// change in the Node API surface (option names, formatter lookup, result shape)
// fails here instead of in a user's build.
const dirs: string[] = [];

const makeProject = async (css: string) => {
  const dir = await mkdtemp(join(tmpdir(), "vite-plugin-stylelint-"));
  dirs.push(dir);
  await writeFile(join(dir, "a.css"), css);
  return dir;
};

const lintProject = async (dir: string) => {
  const emitted: string[] = [];
  const linter = createLinter(
    getOptions({
      include: [join(dir, "**/*.css")],
      formatter: "string",
      // Inline config keeps the test independent of any config file on disk.
      config: { rules: { "color-no-invalid-hex": true } },
      cwd: dir,
      cache: false,
    }),
    { emit: ({ formattedText }) => emitted.push(formattedText) },
  );
  await linter.lintAll();
  return emitted;
};

afterEach(async () => {
  await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true })));
});

describe("createLinter with the installed Stylelint", () => {
  it("reports a rule violation through the formatter and the emit adapter", async () => {
    const dir = await makeProject("a {\n  color: #zzz;\n}\n");
    const emitted = await lintProject(dir);

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toContain("color-no-invalid-hex");
    expect(emitted[0]).toContain("a.css");
  });

  it("emits nothing when the style is valid", async () => {
    const dir = await makeProject("a {\n  color: #fff;\n}\n");

    expect(await lintProject(dir)).toEqual([]);
  });
});
