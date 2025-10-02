const { ALL_SKINS } = require('./src/assets/all-skins.ts');
const { SKINS: UNIFIED_SKINS } = require('./src/assets/unified-skins.ts');

const unifiedIds = new Set(Object.keys(UNIFIED_SKINS));
const newOnly = ALL_SKINS.filter(skin => !unifiedIds.has(skin.id));

console.log('// ===== REMAINING MISSING SKINS FROM NEW SYSTEM =====');
console.log('// Adding', newOnly.length, 'more skins...\n');

newOnly.forEach(skin => {
  // Extract colors from different possible structures
  let colors = [];
  
  if (skin.colors && Array.isArray(skin.colors)) {
    colors = skin.colors;
  } else if (skin.base) {
    // Extract from base structure
    if (skin.base.fill) colors.push(skin.base.fill);
    if (skin.base.stroke && skin.base.stroke !== skin.base.fill) colors.push(skin.base.stroke);
    if (skin.base.shine && skin.base.shine !== skin.base.fill && skin.base.shine !== skin.base.stroke) colors.push(skin.base.shine);
  } else if (skin.pattern && skin.pattern.colors) {
    colors = skin.pattern.colors;
  }
  
  // Fallback to a reasonable default color based on tier
  if (colors.length === 0) {
    const tierColors = {
      'common': '#22c55e',
      'uncommon': '#3b82f6', 
      'rare': '#8b5cf6',
      'epic': '#f59e0b',
      'mythic': '#ef4444'
    };
    colors = [tierColors[skin.tier] || '#22c55e'];
  }
  
  // Determine kind
  let kind = skin.kind || 'solid';
  if (skin.anim || skin.source === 'inspiration') {
    kind = 'animated';
  } else if (colors.length > 1) {
    kind = 'gradient';
  }
  
  console.log(`  ${skin.id}: { id: "${skin.id}", name: "${skin.name}", tier: "${skin.tier}", kind: "${kind}", colors: ["${colors.join('", "')}"] },`);
});

console.log('\n// Total skins to add:', newOnly.length);

