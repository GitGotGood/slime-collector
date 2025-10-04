// Simple prebuild guard: fail build if live UI imports all-skins.ts
// Run from npm scripts before build.

const { execSync } = require('child_process');

function rg(pattern, path) {
  try {
    const out = execSync(`rg -n "${pattern}" ${path}`, { stdio: ['ignore', 'pipe', 'pipe'] })
      .toString();
    return out.trim();
  } catch (e) {
    return '';
  }
}

const LIVE_DIRS = ['src/ui', 'src/app', 'src/ui/shop', 'src/ui/progress'];
const VIOLATIONS = [];

for (const d of LIVE_DIRS) {
  const hits = rg("from \\\"../../assets/all-skins\\\"|from '../assets/all-skins'|from \"../../assets/all-skins\"|from \"../assets/all-skins\"|../../assets/all-skins|../assets/all-skins", d);
  if (hits) VIOLATIONS.push({ dir: d, hits });
}

if (VIOLATIONS.length) {
  console.error('\n❌ Prebuild guard: all-skins.ts imported in live code:\n');
  for (const v of VIOLATIONS) console.error(`- ${v.dir}\n${v.hits}\n`);
  process.exit(1);
}

console.log('✅ Prebuild guard: no all-skins.ts imports in live surfaces');


