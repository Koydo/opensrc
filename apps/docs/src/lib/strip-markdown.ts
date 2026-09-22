/**
 * Reduces rendered Markdown/MDX to plain text for the search index.
 *
 * This is deliberately not an HTML sanitizer. Its security invariant is
 * simpler: indexed text must never retain an HTML opening delimiter, including
 * when a source document contains a truncated or malformed tag.
 */
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/</g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
