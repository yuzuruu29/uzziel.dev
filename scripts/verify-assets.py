"""Verify all image/video src paths referenced in work MDX files exist under public/."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MDX_DIR = ROOT / "src" / "content" / "work"
PUBLIC = ROOT / "public"

missing: list[tuple[str, str]] = []
for mdx in sorted(MDX_DIR.glob("*.mdx")):
    text = mdx.read_text(encoding="utf-8")
    for src in re.findall(r'src="(/[^"]+)"', text):
        if not (PUBLIC / src.lstrip("/")).exists():
            missing.append((mdx.name, src))

if missing:
    print(f"MISSING ({len(missing)}):")
    for name, src in missing:
        print(f"  {name}: {src}")
    sys.exit(1)

print(f"OK — all assets exist for {len(list(MDX_DIR.glob('*.mdx')))} work entries.")
sys.exit(0)