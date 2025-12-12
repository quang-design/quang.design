import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const contentBlogDir = path.join(rootDir, 'src', 'content', 'blog');
const staticBlogDir = path.join(rootDir, 'static', 'blog', 'posts');

async function copyDir(srcDir, destDir) {
    await fs.mkdir(destDir, { recursive: true });
    const entries = await fs.readdir(srcDir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name === 'post.md') continue;
        if (entry.name.startsWith('.')) continue;
        const src = path.join(srcDir, entry.name);
        const dest = path.join(destDir, entry.name);
        if (entry.isDirectory()) {
            await copyDir(src, dest);
        } else if (entry.isFile()) {
            await fs.copyFile(src, dest);
        }
    }
}

async function main() {
    let slugs;
    try {
        slugs = await fs.readdir(contentBlogDir, { withFileTypes: true });
    } catch {
        return;
    }

    await fs.mkdir(staticBlogDir, { recursive: true });

    for (const entry of slugs) {
        if (!entry.isDirectory()) continue;
        const slug = entry.name;
        const srcDir = path.join(contentBlogDir, slug);
        const destDir = path.join(staticBlogDir, slug);
        await fs.rm(destDir, { recursive: true, force: true });
        await copyDir(srcDir, destDir);
    }
}

await main();
