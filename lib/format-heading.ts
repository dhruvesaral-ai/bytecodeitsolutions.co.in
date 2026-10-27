/**
 * Utility to format and normalize HTML headings received from the backend/CMS.
 *
 * Supports:
 * - Shorthand color syntax: <span style="orange"> or <span style="blue">
 * - Tag attributes: <span color="orange"> or <span class="orange">
 * - Maps 'orange' and 'blue' to the brand theme colors (#F58216 and #1550A5)
 * - Auto-corrects malformed/mistyped closing tags like <span style="...">text<span> -> </span>
 * - Balances and closes unclosed tags
 */
export function formatHeadingHtml(html: string): string {
  if (!html || typeof html !== "string") return "";

  let result = html;

  // 1. Fix mistyped trailing <span> tags (e.g. '<span>' instead of '</span>' when closing an existing span)
  result = result.replace(/(<span\b[^>]*>(?:(?!<\/span>)[\s\S])*?)<span>/gi, "$1</span>");

  // 2. Class-based colors: class="orange" or class="blue"
  result = result.replace(/\bclass=(["'])\s*orange\s*\1/gi, 'style="color: var(--color-orange, #F58216);"');
  result = result.replace(/\bclass=(["'])\s*blue\s*\1/gi, 'style="color: var(--color-blue, #1550A5);"');

  // 3. Normalize style attributes that only contain a color name or hex without "color:"
  // e.g. style="orange", style="blue", style="#1550A5"
  result = result.replace(/style=(["'])([^"':;]+)\1/gi, (match, quote, val) => {
    const trimmed = val.trim().toLowerCase();
    if (trimmed === "orange") {
      return `style=${quote}color: var(--color-orange, #F58216);${quote}`;
    }
    if (trimmed === "blue") {
      return `style=${quote}color: var(--color-blue, #1550A5);${quote}`;
    }
    if (/^[a-z]+$|^#[0-9a-f]{3,8}$/i.test(trimmed)) {
      return `style=${quote}color: ${trimmed};${quote}`;
    }
    return match;
  });

  // 4. Normalize color="..." attributes (e.g. <span color="orange">)
  result = result.replace(/\bcolor=(["'])([^"']+)\1/gi, (match, quote, val) => {
    const trimmed = val.trim().toLowerCase();
    if (trimmed === "orange") {
      return `style=${quote}color: var(--color-orange, #F58216);${quote}`;
    }
    if (trimmed === "blue") {
      return `style=${quote}color: var(--color-blue, #1550A5);${quote}`;
    }
    return `style=${quote}color: ${val};${quote}`;
  });

  // 5. Map standard CSS 'color: orange' and 'color: blue' to exact brand palette
  result = result.replace(/color\s*:\s*orange\b/gi, "color: var(--color-orange, #F58216)");
  result = result.replace(/color\s*:\s*blue\b/gi, "color: var(--color-blue, #1550A5)");

  // 6. Ensure all opened HTML tags are properly closed
  const tagStack: string[] = [];
  const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
  let tagMatch: RegExpExecArray | null;
  while ((tagMatch = tagRegex.exec(result)) !== null) {
    const fullTag = tagMatch[0];
    const tagName = tagMatch[1].toLowerCase();
    const isSelfClosing = fullTag.endsWith("/>") || ["br", "hr", "img", "input"].includes(tagName);
    if (isSelfClosing) continue;

    if (fullTag.startsWith("</")) {
      if (tagStack.length > 0 && tagStack[tagStack.length - 1] === tagName) {
        tagStack.pop();
      }
    } else {
      tagStack.push(tagName);
    }
  }

  while (tagStack.length > 0) {
    const unclosed = tagStack.pop();
    result += `</${unclosed}>`;
  }

  return result;
}
