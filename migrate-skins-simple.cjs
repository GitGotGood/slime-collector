#!/usr/bin/env node

/**
 * Simple Skin Migration Script
 * 
 * This script consolidates all skins from skins.ts and all-skins.ts into a single
 * unified-skins-v2.ts file, applying user choices and ensuring no data loss.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Keystone skins that must not lose data
  KEYSTONE_SKINS: [
    'nebula', 'bubble_rise', 'aurora_veil', 'acorn', 'phoenix_heart', 
    'synthwave', 'ionosong', 'firefly_anim', 'deep_space_parallax'
  ],
  
  // Valid animation types (from your renderer)
  VALID_ANIMS: [
    'none', 'deep_space_parallax', 'firefly', 'twinkle', 'slowRotate',
    'parallax', 'bubble_rise', 'phoenix_heart', 'aurora_veil'
  ],
  
  // Valid pattern types (from your renderer)
  VALID_PATTERN_TYPES: [
    'flat', 'linearBands', 'conicSwirl', 'dots', 'noiseSoft', 'grid',
    'static_swirl', 'conic_gradient', 'logarithmic_spiral'
  ],
  
  // Default values for missing fields
  DEFAULTS: {
    base: { fill: '#9ca3af', stroke: '#0b0f17', shine: '#ffffff' },
    pattern: { type: 'flat', colors: ['#9ca3af'] },
    anim: 'none',
    source: 'production',
    tier: 'common'
  }
};

// Load choice files
function loadChoiceFiles() {
  const choiceFiles = [
    'src/assets/skin-comparison-choices-2025-09-25.json',
    'src/assets/skin-comparison-choices-2025-09-26.json',
    'src/assets/skin-comparison-choices-2025-09-26 (2).json',
    'src/assets/skin-comparison-choices-2025-09-27.json'
  ];
  
  const allChoices = {};
  
  for (const file of choiceFiles) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const choices = JSON.parse(content);
        if (choices.choices) {
          Object.assign(allChoices, choices.choices);
        }
      } catch (error) {
        console.warn(`Warning: Could not load ${file}:`, error.message);
      }
    }
  }
  
  return allChoices;
}

// Load skins using a different approach - read the existing unified-skins.ts
function loadExistingUnifiedSkins() {
  try {
    const content = fs.readFileSync('src/assets/unified-skins.ts', 'utf8');
    
    // Find the SKINS object
    const match = content.match(/export const SKINS: Record<string, Skin> = ({[\s\S]*?});/);
    if (!match) {
      throw new Error('Could not find SKINS export in unified-skins.ts');
    }
    
    const skinsCode = match[1];
    return eval(`(${skinsCode})`);
  } catch (error) {
    console.error(`Error loading existing unified skins:`, error.message);
    return {};
  }
}

// Load skins from all-skins.ts by parsing the file manually
function loadAllSkins() {
  try {
    const content = fs.readFileSync('src/assets/all-skins.ts', 'utf8');
    
    // Find all skin objects in the file
    const skinMatches = content.match(/\{\s*id:\s*['"`]([^'"`]+)['"`][\s\S]*?\}/g);
    if (!skinMatches) {
      throw new Error('Could not find any skin objects in all-skins.ts');
    }
    
    const skins = {};
    skinMatches.forEach(match => {
      try {
        const skin = eval(`(${match})`);
        if (skin && skin.id) {
          skins[skin.id] = skin;
        }
      } catch (e) {
        // Skip invalid matches
      }
    });
    
    return skins;
  } catch (error) {
    console.error(`Error loading all-skins.ts:`, error.message);
    return {};
  }
}

// Migrate a skin from the old system
function migrateFromOld(oldSkin, warnings = []) {
  const unified = {
    id: oldSkin.id,
    name: oldSkin.name,
    tier: oldSkin.tier || CONFIG.DEFAULTS.tier,
    source: 'production',
    kind: oldSkin.kind || 'solid',
    colors: oldSkin.colors || [CONFIG.DEFAULTS.base.fill],
    base: oldSkin.base || CONFIG.DEFAULTS.base,
    pattern: oldSkin.pattern || CONFIG.DEFAULTS.pattern,
    anim: oldSkin.anim || CONFIG.DEFAULTS.anim,
    migratedFrom: 'old'
  };
  
  // Add warnings for missing fields
  if (!oldSkin.base) warnings.push(`Missing base data for ${oldSkin.id}`);
  if (!oldSkin.pattern) warnings.push(`Missing pattern data for ${oldSkin.id}`);
  if (!oldSkin.anim) warnings.push(`Missing animation data for ${oldSkin.id}`);
  
  return { skin: unified, warnings };
}

// Migrate a skin from the new system
function migrateFromNew(newSkin, warnings = []) {
  const unified = {
    id: newSkin.id,
    name: newSkin.name,
    tier: newSkin.tier || CONFIG.DEFAULTS.tier,
    source: newSkin.source || 'production',
    kind: newSkin.kind || 'solid',
    colors: newSkin.colors || [CONFIG.DEFAULTS.base.fill],
    base: newSkin.base || CONFIG.DEFAULTS.base,
    pattern: newSkin.pattern || CONFIG.DEFAULTS.pattern,
    anim: newSkin.anim || CONFIG.DEFAULTS.anim,
    migratedFrom: 'new'
  };
  
  // Preserve additional fields if present
  if (newSkin.bio) unified.bio = newSkin.bio;
  if (newSkin.origin) unified.origin = newSkin.origin;
  if (newSkin.tags) unified.tags = newSkin.tags;
  
  // Add warnings for missing fields
  if (!newSkin.base) warnings.push(`Missing base data for ${newSkin.id}`);
  if (!newSkin.pattern) warnings.push(`Missing pattern data for ${newSkin.id}`);
  if (!newSkin.anim) warnings.push(`Missing animation data for ${newSkin.id}`);
  
  return { skin: unified, warnings };
}

// Merge two skins based on user choice
function mergeSkins(choice, oldSkin, newSkin, warnings = []) {
  let unified;
  
  switch (choice) {
    case 'old':
      unified = migrateFromOld(oldSkin, warnings).skin;
      // Augment with any missing rich fields from new
      if (newSkin.bio && !unified.bio) unified.bio = newSkin.bio;
      if (newSkin.origin && !unified.origin) unified.origin = newSkin.origin;
      if (newSkin.tags && !unified.tags) unified.tags = newSkin.tags;
      break;
      
    case 'new':
      unified = migrateFromNew(newSkin, warnings).skin;
      break;
      
    case 'merge':
    default:
      // Use new as base, but preserve old fields if new is missing
      unified = migrateFromNew(newSkin, warnings).skin;
      if (!unified.base && oldSkin.base) unified.base = oldSkin.base;
      if (!unified.pattern && oldSkin.pattern) unified.pattern = oldSkin.pattern;
      if (!unified.anim && oldSkin.anim) unified.anim = oldSkin.anim;
      break;
  }
  
  unified.migratedFrom = 'merge';
  return { skin: unified, warnings };
}

// Validate a unified skin
function validateSkin(skin, warnings = []) {
  // Check required fields
  if (!skin.id) warnings.push(`Missing ID for skin`);
  if (!skin.name) warnings.push(`Missing name for ${skin.id}`);
  if (!skin.tier) warnings.push(`Missing tier for ${skin.id}`);
  
  // Validate base colors
  if (skin.base) {
    if (!isValidHex(skin.base.fill)) warnings.push(`Invalid base.fill for ${skin.id}: ${skin.base.fill}`);
    if (!isValidHex(skin.base.stroke)) warnings.push(`Invalid base.stroke for ${skin.id}: ${skin.base.stroke}`);
    if (!isValidHex(skin.base.shine)) warnings.push(`Invalid base.shine for ${skin.id}: ${skin.base.shine}`);
  }
  
  // Validate animation
  if (skin.anim && !CONFIG.VALID_ANIMS.includes(skin.anim)) {
    warnings.push(`Unknown animation type for ${skin.id}: ${skin.anim}`);
  }
  
  // Validate pattern
  if (skin.pattern && skin.pattern.type && !CONFIG.VALID_PATTERN_TYPES.includes(skin.pattern.type)) {
    warnings.push(`Unknown pattern type for ${skin.id}: ${skin.pattern.type}`);
  }
  
  return warnings;
}

// Check if a string is a valid hex color
function isValidHex(color) {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

// Pick the richer version when no choice is made
function pickRicherVersion(skinId, oldSkins, newSkins) {
  const oldSkin = oldSkins[skinId];
  const newSkin = newSkins[skinId];
  
  if (!oldSkin && !newSkin) return null;
  if (!oldSkin) return migrateFromNew(newSkin);
  if (!newSkin) return migrateFromOld(oldSkin);
  
  // Prefer new system (usually richer)
  return migrateFromNew(newSkin);
}

// Main migration function
function migrateSkins() {
  console.log('🚀 Starting skin migration...');
  
  // Load all data
  console.log('📁 Loading skin data...');
  const oldSkins = loadExistingUnifiedSkins();
  const newSkins = loadAllSkins();
  const userChoices = loadChoiceFiles();
  
  console.log(`   Old system: ${Object.keys(oldSkins).length} skins`);
  console.log(`   New system: ${Object.keys(newSkins).length} skins`);
  console.log(`   User choices: ${Object.keys(userChoices).length} decisions`);
  
  // Get all unique skin IDs
  const allUniqueIds = new Set([
    ...Object.keys(oldSkins),
    ...Object.keys(newSkins)
  ]);
  
  console.log(`   Total unique skins: ${allUniqueIds.size}`);
  
  // Migrate each skin
  const unifiedSkins = {};
  const allWarnings = [];
  const keystoneWarnings = [];
  
  for (const skinId of allUniqueIds) {
    const warnings = [];
    let result;
    
    if (userChoices[skinId]) {
      // Apply user choice
      const choiceData = userChoices[skinId];
      const choice = choiceData.choice || choiceData; // Handle both object and string formats
      const oldSkin = oldSkins[skinId];
      const newSkin = newSkins[skinId];
      
      if ((choice === 'old' || choice === 'variant-1') && oldSkin) {
        result = migrateFromOld(oldSkin, warnings);
      } else if ((choice === 'new' || choice === 'variant-2') && newSkin) {
        result = migrateFromNew(newSkin, warnings);
      } else if (choice === 'merge' && oldSkin && newSkin) {
        result = mergeSkins(choice, oldSkin, newSkin, warnings);
      } else {
        // Fallback to richer version
        result = pickRicherVersion(skinId, oldSkins, newSkins);
        warnings.push(`Choice '${choice}' not applicable, using richer version`);
      }
    } else {
      // No choice made, pick richer version
      result = pickRicherVersion(skinId, oldSkins, newSkins);
    }
    
    if (result && result.skin) {
      // Validate the skin
      const validationWarnings = validateSkin(result.skin);
      warnings.push(...validationWarnings);
      
      // Check for keystone warnings
      if (CONFIG.KEYSTONE_SKINS.includes(skinId) && warnings.length > 0) {
        keystoneWarnings.push(`${skinId}: ${warnings.join(', ')}`);
      }
      
      unifiedSkins[skinId] = result.skin;
      allWarnings.push(...warnings.map(w => `${skinId}: ${w}`));
    }
  }
  
  // Check for critical issues
  if (keystoneWarnings.length > 0) {
    console.warn('⚠️  WARNING: Keystone skins have warnings:');
    keystoneWarnings.forEach(warning => console.warn(`   ${warning}`));
    console.warn('   Continuing migration with warnings...');
  }
  
  // Generate the output file
  console.log('📝 Generating unified-skins-v2.ts...');
  const outputContent = generateOutputFile(unifiedSkins);
  fs.writeFileSync('src/assets/unified-skins-v2.ts', outputContent);
  
  // Generate migration report
  const report = {
    timestamp: new Date().toISOString(),
    totalSkins: Object.keys(unifiedSkins).length,
    oldSystemSkins: Object.keys(oldSkins).length,
    newSystemSkins: Object.keys(newSkins).length,
    userChoices: Object.keys(userChoices).length,
    warnings: allWarnings,
    keystoneWarnings: keystoneWarnings,
    summary: {
      migratedFromOld: Object.values(unifiedSkins).filter(s => s.migratedFrom === 'old').length,
      migratedFromNew: Object.values(unifiedSkins).filter(s => s.migratedFrom === 'new').length,
      merged: Object.values(unifiedSkins).filter(s => s.migratedFrom === 'merge').length
    }
  };
  
  fs.writeFileSync('migration-report.json', JSON.stringify(report, null, 2));
  
  console.log('✅ Migration completed successfully!');
  console.log(`   Generated: src/assets/unified-skins-v2.ts (${Object.keys(unifiedSkins).length} skins)`);
  console.log(`   Report: migration-report.json`);
  console.log(`   Warnings: ${allWarnings.length}`);
  
  if (allWarnings.length > 0) {
    console.log('⚠️  Warnings:');
    allWarnings.slice(0, 10).forEach(warning => console.log(`   ${warning}`));
    if (allWarnings.length > 10) {
      console.log(`   ... and ${allWarnings.length - 10} more (see migration-report.json)`);
    }
  }
}

// Generate the output TypeScript file
function generateOutputFile(skins) {
  const header = `/**
 * Unified Skins - Generated by Migration Script
 * 
 * This file contains all consolidated skin definitions from both the old and new systems.
 * Generated on: ${new Date().toISOString()}
 * 
 * DO NOT EDIT MANUALLY - Use the migration script instead.
 */

export interface UnifiedSkin {
  id: string;
  name: string;
  tier: "common" | "uncommon" | "rare" | "legendary" | "epic" | "mythic" | "event";
  source: "production" | "inspiration" | "pre-production";
  kind: "solid" | "animated" | "patterned";
  colors: string[];
  base: {
    fill: string;
    stroke: string;
    shine: string;
  };
  pattern: {
    type: string;
    colors?: string[];
    [key: string]: any;
  };
  anim: string;
  migratedFrom?: "old" | "new" | "merge";
  bio?: string;
  origin?: {
    type: string;
    source: string;
    displayName: string;
  };
  tags?: string[];
}

export const SKINS: Record<string, UnifiedSkin> = {
`;

  const footer = `};

export default SKINS;
`;

  // Sort skins by tier, then by name
  const sortedSkins = Object.entries(skins).sort(([, a], [, b]) => {
    const tierOrder = { common: 0, uncommon: 1, rare: 2, legendary: 3, epic: 4, mythic: 5, event: 6 };
    const tierDiff = (tierOrder[a.tier] || 0) - (tierOrder[b.tier] || 0);
    if (tierDiff !== 0) return tierDiff;
    return a.name.localeCompare(b.name);
  });

  const skinEntries = sortedSkins.map(([id, skin]) => {
    const skinStr = JSON.stringify(skin, null, 2);
    return `  ${id}: ${skinStr}`;
  }).join(',\n\n');

  return header + skinEntries + '\n' + footer;
}

// Run the migration
if (require.main === module) {
  migrateSkins();
}

module.exports = { migrateSkins, CONFIG };
