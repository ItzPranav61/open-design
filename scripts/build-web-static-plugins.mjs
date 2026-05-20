import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const officialRoot = path.join(root, 'plugins', '_official');
const outJson = path.join(root, 'apps', 'web', 'src', 'static', 'official-plugins.json');
const outAssets = path.join(root, 'apps', 'web', 'public', 'official-plugins');

const SAFE_DIR = /^[a-z0-9][a-z0-9._-]*$/i;

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(from, to);
    } else if (entry.isFile()) {
      await fs.copyFile(from, to);
    }
  }
}

async function pluginFolders() {
  const folders = [];
  const top = await fs.readdir(officialRoot, { withFileTypes: true });
  for (const tier of top) {
    if (!tier.isDirectory()) continue;
    const tierAbs = path.join(officialRoot, tier.name);
    if (await exists(path.join(tierAbs, 'open-design.json'))) {
      folders.push(tierAbs);
      continue;
    }
    const inner = await fs.readdir(tierAbs, { withFileTypes: true }).catch(() => []);
    for (const entry of inner) {
      if (!entry.isDirectory()) continue;
      const folder = path.join(tierAbs, entry.name);
      if (await exists(path.join(folder, 'open-design.json'))) folders.push(folder);
    }
  }
  return folders;
}

function relToPosix(abs) {
  return path.relative(root, abs).split(path.sep).join('/');
}

await fs.mkdir(path.dirname(outJson), { recursive: true });
await fs.rm(outAssets, { recursive: true, force: true });
await fs.mkdir(outAssets, { recursive: true });

const now = 0;
const records = [];

for (const folder of await pluginFolders()) {
  const folderName = path.basename(folder);
  if (!SAFE_DIR.test(folderName)) continue;
  const manifest = await readJson(path.join(folder, 'open-design.json'));
  const id = String(manifest.name ?? folderName).toLowerCase();
  if (!SAFE_DIR.test(id)) continue;
  const source = relToPosix(folder);
  records.push({
    id,
    title: manifest.title ?? manifest.name ?? id,
    version: manifest.version ?? '0.0.0',
    sourceKind: 'bundled',
    source,
    sourceMarketplaceId: 'official',
    sourceMarketplaceEntryName: `official/${id}`,
    sourceMarketplaceEntryVersion: manifest.version ?? '0.0.0',
    marketplaceTrust: 'official',
    resolvedSource: source,
    trust: 'bundled',
    capabilitiesGranted: ['prompt:inject'],
    manifest,
    fsPath: source,
    installedAt: now,
    updatedAt: now,
  });
  await copyDir(folder, path.join(outAssets, id));
}

records.sort((a, b) => a.title.localeCompare(b.title));
await fs.writeFile(outJson, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
console.log(`Wrote ${records.length} static official plugins to ${relToPosix(outJson)}`);
