export interface ParsedAnswer {
  /** Markdown body with the `suggestions` fenced block stripped out. */
  body: string;
  /** Suggested follow-up questions emitted by the bot. */
  suggestions: string[];
}

// Bot is instructed to end every response with:
//   ```suggestions
//   ["Câu 1", "Câu 2"]
//   ```
// The block must be stripped before rendering — otherwise it shows up as a
// raw code block in the answer card.
const SUGGESTIONS_RE = /```\s*suggestions\s*\n?([\s\S]*?)```/i;

function parseJsonArray(raw: string): string[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (s): s is string => typeof s === "string" && s.trim().length > 0,
    );
  } catch {
    return null;
  }
}

// Defensive fallback: if the bot drifts (single quotes, trailing commas, items
// on bare lines), still salvage the suggestions instead of dropping them.
function parseLineFallback(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.replace(/^[\s\-*•\d.)("']+|[\s,"']+$/g, "").trim())
    .filter((line) => line.length > 0 && line !== "[" && line !== "]");
}

export function parseSuggestions(markdown: string): ParsedAnswer {
  const match = markdown.match(SUGGESTIONS_RE);
  if (!match || !match[1]) {
    return { body: markdown.trimEnd(), suggestions: [] };
  }

  const inner = match[1].trim();
  const fromJson = parseJsonArray(inner);
  const suggestions = fromJson ?? parseLineFallback(inner);

  const body = markdown.replace(SUGGESTIONS_RE, "").trimEnd();
  return { body, suggestions: suggestions.slice(0, 6) };
}
