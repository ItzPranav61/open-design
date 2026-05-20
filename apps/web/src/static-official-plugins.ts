import type { InstalledPluginRecord } from '@open-design/contracts';
import officialPlugins from './static/official-plugins.json';

const staticPlugins = officialPlugins as InstalledPluginRecord[];

export function listStaticOfficialPlugins(): InstalledPluginRecord[] {
  return staticPlugins;
}

export function findStaticOfficialPlugin(id: string): InstalledPluginRecord | null {
  return staticPlugins.find((plugin) => plugin.id === id) ?? null;
}

export function staticOfficialPluginAssetUrl(
  record: InstalledPluginRecord,
  relpath: string | null | undefined,
): string | null {
  if (!relpath || !isStaticOfficialPlugin(record)) return null;
  if (/^(?:https?:|data:|blob:)/i.test(relpath)) return relpath;
  const clean = relpath
    .replace(/^\.\//, '')
    .split(/[\\/]/)
    .filter(Boolean);
  if (clean.length === 0 || clean.some((segment) => segment === '..')) return null;
  return `/official-plugins/${encodeURIComponent(record.id)}/${clean
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`;
}

function isStaticOfficialPlugin(record: InstalledPluginRecord): boolean {
  return (
    record.sourceKind === 'bundled' &&
    typeof record.source === 'string' &&
    record.source.startsWith('plugins/_official/')
  );
}
