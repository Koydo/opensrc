import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const rootPackage = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const docsPackage = JSON.parse(
  await readFile(new URL("../apps/docs/package.json", import.meta.url), "utf8"),
);
const lockfile = await readFile(
  new URL("../pnpm-lock.yaml", import.meta.url),
  "utf8",
);

test("Docs dependency manifests retain the audited security floors", () => {
  assert.equal(rootPackage.devDependencies.turbo, "^2.11.2");
  assert.equal(docsPackage.dependencies["@next/mdx"], "^16.3.5");
  assert.equal(docsPackage.dependencies["bash-tool"], "^1.3.19");
  assert.equal(docsPackage.dependencies["just-bash"], "^3.4.2");
  assert.equal(docsPackage.dependencies.next, "^16.3.5");
  assert.equal(docsPackage.dependencies.streamdown, "^2.6.0");
});

test("Resolved lock retains the fixed non-AI dependency graph", () => {
  for (const entry of [
    "@next/mdx@16.3.5",
    "just-bash@3.4.2",
    "next@16.3.5",
    "streamdown@2.6.0",
    "turbo@2.11.2",
  ]) {
    assert.match(
      lockfile,
      new RegExp(
        `^  ['"]?${entry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"]?:`,
        "m",
      ),
    );
  }

  assert.doesNotMatch(lockfile, /^  next@15\.5\.15:/m);
});
