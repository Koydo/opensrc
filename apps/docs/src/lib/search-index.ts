import { readFile } from "fs/promises";
import { join } from "path";
import { allDocsPages } from "./docs-navigation";
import { mdxToCleanMarkdown } from "./mdx-to-markdown";
import { stripMarkdown } from "./strip-markdown";

export type IndexEntry = {
  title: string;
  href: string;
  content: string;
};

let cached: IndexEntry[] | null = null;

function mdxFileForSlug(slug: string): string {
  const docsRoot = join(process.cwd(), "src", "app");
  if (slug === "/") {
    return join(docsRoot, "page.mdx");
  }
  const rest = slug.replace(/^\//, "");
  return join(docsRoot, ...rest.split("/"), "page.mdx");
}

export async function getSearchIndex(): Promise<IndexEntry[]> {
  if (cached) return cached;

  const entries: IndexEntry[] = [];

  for (const item of allDocsPages) {
    try {
      const raw = await readFile(mdxFileForSlug(item.href), "utf-8");
      const md = mdxToCleanMarkdown(raw);
      const content = stripMarkdown(md);
      entries.push({
        title: item.name,
        href: item.href,
        content,
      });
    } catch {
      entries.push({
        title: item.name,
        href: item.href,
        content: "",
      });
    }
  }

  cached = entries;
  return entries;
}
