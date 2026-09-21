import assert from "node:assert/strict";
import test from "node:test";

import { stripMarkdown } from "./strip-markdown.ts";

test("search-index stripping removes complete and truncated HTML tag openings", () => {
  const malformedMarkup = [
    "<script>alert('complete')</script>",
    "<script>alert('truncated')",
    "prefix <ScRiPt src=evil.example/x.js",
    "<img src=x onerror=alert('truncated')",
  ];

  for (const input of malformedMarkup) {
    const indexedText = stripMarkdown(input);

    assert.equal(indexedText.includes("<"), false, input);
    assert.doesNotMatch(indexedText, /<\s*script/i, input);
  }
});

test("search-index stripping preserves intended Markdown text", () => {
  assert.equal(
    stripMarkdown("# Heading\n\nA **bold** [link](https://example.com) and `code`."),
    "Heading\n\nA bold link and .",
  );
});
