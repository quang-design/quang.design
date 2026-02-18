#!/usr/bin/env python3
import re
import os
import urllib.request
from pathlib import Path

DESIGN_DIR = Path(__file__).parent.parent / "src/content/design"

for md_file in sorted(DESIGN_DIR.glob("*/post.md")):
    project_dir = md_file.parent
    project_name = project_dir.name
    print(f"Processing: {project_name}")

    content = md_file.read_text(encoding="utf-8")
    urls = sorted(set(re.findall(r"https://freight\.cargo\.site[^\s\"')\]]+", content)))

    if not urls:
        print("  No cargo URLs found, skipping.")
        continue

    for url in urls:
        filename = url.split("/")[-1]
        local_path = project_dir / filename
        relative_path = f"./{filename}"

        if local_path.exists():
            print(f"  Already exists: {filename}")
        else:
            print(f"  Downloading: {filename}")
            try:
                urllib.request.urlretrieve(url, local_path)
            except Exception as e:
                print(f"  FAILED {url}: {e}")
                continue

        content = content.replace(url, relative_path)

    md_file.write_text(content, encoding="utf-8")
    print(f"  Done: {project_name}")

print("\nAll done!")
