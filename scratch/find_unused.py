import os
import re

def find_unused_files(root_dir):
    # Directories to check for unused files
    asset_dirs = ['uploads', 'styles', 'fonts', 'assets', 'scripts']
    
    # Files to exclude from "unused" check (entry points or config)
    exclude_files = {
        'index.html', 'package.json', 'package-lock.json', 'robots.txt', 
        'sitemap.xml', 'update.py', 'update_footers.js', 'auditoria_seo_geo_koda.md'
    }
    
    all_assets = []
    for d in asset_dirs:
        dir_path = os.path.join(root_dir, d)
        if os.path.exists(dir_path):
            for r, _, files in os.walk(dir_path):
                for f in files:
                    full_path = os.path.join(r, f)
                    rel_path = os.path.relpath(full_path, root_dir)
                    if f not in exclude_files:
                        all_assets.append(rel_path)

    # Files to search IN for references
    search_in_files = []
    for r, _, files in os.walk(root_dir):
        if 'node_modules' in r or '.git' in r or 'dist' in r:
            continue
        for f in files:
            if f.endswith(('.html', '.css', '.js', '.xml', '.json')):
                search_in_files.append(os.path.join(r, f))

    # Read content of all search files
    combined_content = ""
    for f in search_in_files:
        try:
            with open(f, 'r', encoding='utf-8', errors='ignore') as file:
                combined_content += file.read() + "\n"
        except Exception as e:
            print(f"Error reading {f}: {e}")

    unused = []
    for asset in all_assets:
        # Check for the filename or the relative path
        filename = os.path.basename(asset)
        # Some references might be relative, some might be absolute-ish from root
        # We check for the filename first, then the path
        if filename not in combined_content and asset not in combined_content:
            # Try escaping for regex if needed, but simple 'in' check is often enough for filenames
            unused.append(asset)

    return unused

if __name__ == "__main__":
    root = "/Users/hendrick/Documents/Landing page"
    unused_files = find_unused_files(root)
    
    print("--- UNUSED FILES REPORT ---")
    if not unused_files:
        print("No unused files found.")
    else:
        for f in sorted(unused_files):
            print(f)
