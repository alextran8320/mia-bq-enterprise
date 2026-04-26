export interface ExtractedLink {
  text: string;
  url: string;
  host: string;
}

export interface ExtractedHeading {
  level: 2 | 3;
  text: string;
}

export interface ExtractedSources {
  links: ExtractedLink[];
  outline: ExtractedHeading[];
}

const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
const HEADING_RE = /^(#{2,3})\s+(.+?)\s*$/gm;

function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export function extractSources(markdown: string): ExtractedSources {
  const links: ExtractedLink[] = [];
  const seen = new Set<string>();

  for (const match of markdown.matchAll(LINK_RE)) {
    const [, text, url] = match;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    links.push({ text: text?.trim() || url, url, host: safeHost(url) });
  }

  const outline: ExtractedHeading[] = [];
  for (const match of markdown.matchAll(HEADING_RE)) {
    const [, hashes, text] = match;
    if (!hashes || !text) continue;
    outline.push({ level: hashes.length === 2 ? 2 : 3, text: text.trim() });
  }

  return { links, outline };
}
