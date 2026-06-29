export type A2uiJsonParseFailureReason = 'missing-json' | 'invalid-json';

export type A2uiJsonParseResult =
  | {
      ok: true;
      value: unknown;
      source: 'a2ui-block' | 'plain-json';
    }
  | {
      ok: false;
      reason: A2uiJsonParseFailureReason;
      error: string;
    };

const A2UI_BLOCK_PATTERN = /```(?:a2ui|a2ui-json)\s*([\s\S]*?)```|<a2ui\b[^>]*>([\s\S]*?)<\/a2ui>/i;

export function parseA2uiJsonFromText(input: string): A2uiJsonParseResult {
  const blockMatch = A2UI_BLOCK_PATTERN.exec(input);
  const sourceText = blockMatch ? blockMatch[1] ?? blockMatch[2] ?? '' : input;
  const jsonText = extractFirstJsonValue(sourceText);

  if (!jsonText) {
    return {
      ok: false,
      reason: 'missing-json',
      error: blockMatch
        ? 'No JSON object or array found in A2UI block.'
        : 'No JSON object or array found in text.',
    };
  }

  try {
    return {
      ok: true,
      value: JSON.parse(jsonText),
      source: blockMatch ? 'a2ui-block' : 'plain-json',
    };
  } catch (error) {
    return {
      ok: false,
      reason: 'invalid-json',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function parseA2uiJsonFromTextOrThrow(input: string): unknown {
  const result = parseA2uiJsonFromText(input);

  if (!result.ok) {
    throw new Error(`Failed to parse A2UI JSON: ${result.error}`);
  }

  return result.value;
}

function extractFirstJsonValue(input: string): string | null {
  const start = findJsonStart(input);
  if (start === -1) return null;

  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (let index = start; index < input.length; index++) {
    const char = input[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = inString;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{' || char === '[') {
      stack.push(char === '{' ? '}' : ']');
      continue;
    }

    if (char === '}' || char === ']') {
      const expected = stack.pop();
      if (expected !== char) return null;
      if (stack.length === 0) {
        return input.slice(start, index + 1);
      }
    }
  }

  return null;
}

function findJsonStart(input: string): number {
  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (char === '{') return index;
    if (char === '[' && isLikelyJsonArray(input, index)) return index;
  }

  return -1;
}

function isLikelyJsonArray(input: string, index: number): boolean {
  const next = input.slice(index + 1).trimStart()[0];
  return next === '{' || next === '[' || next === '"' || next === ']' || next === '-' || isDigit(next);
}

function isDigit(value: string | undefined): boolean {
  return value !== undefined && value >= '0' && value <= '9';
}
