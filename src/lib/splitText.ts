export interface SplitChar {
  char: string;
  index: number;
  isSpace: boolean;
}

export interface SplitWord {
  chars: SplitChar[];
  isSpace: boolean;
}

export function splitChars(text: string): SplitChar[] {
  return Array.from(text).map((char, index) => ({
    char,
    index,
    isSpace: char === ' ',
  }));
}

export function splitWords(text: string): SplitWord[] {
  const all = splitChars(text);
  const groups: SplitWord[] = [];
  let buf: SplitChar[] = [];
  for (const c of all) {
    if (c.isSpace) {
      if (buf.length) groups.push({ chars: buf, isSpace: false });
      groups.push({ chars: [c], isSpace: true });
      buf = [];
    } else {
      buf.push(c);
    }
  }
  if (buf.length) groups.push({ chars: buf, isSpace: false });
  return groups;
}
