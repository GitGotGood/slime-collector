import React, { useState, useMemo } from 'react';
import { SKINS } from '../assets/skins';
import { ALL_SKINS } from '../assets/all-skins';
import UnifiedSlimeRenderer from '../ui/components/UnifiedSlimeRenderer';

// Types for the comparison tool
type ComparisonChoice = "old" | "new" | "merge:base=old+readability=new" | "merge:base=new+readability=old";

type ComparisonResult = {
  skinId: string;
  choice: ComparisonChoice;
  notes?: string;
};

type DuplicateSkin = {
  id: string;
  name: string;
  variants: Array<{
    source: string; // 'skins.ts', 'all-skins.ts', etc.
    skin: any;
    index: number;
  }>;
  differences: string[];
};

// Mock biome backgrounds for context preview
const BIOME_BACKGROUNDS = {
  light: '#f8fafc', // Light gray
  dark: '#1e293b',  // Dark slate
  meadow: '#dcfce7', // Light green
  beach: '#fef3c7', // Light yellow
  forest: '#dcfce7', // Light green
  desert: '#fed7aa', // Light orange
};

export const SkinComparisonTool: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<Record<string, ComparisonResult>>({});
  const [previewContext, setPreviewContext] = useState<'thumbnail' | 'in-play' | 'gallery'>('thumbnail');
  const [biomeBackground, setBiomeBackground] = useState<keyof typeof BIOME_BACKGROUNDS>('light');
  const [showOnlyDuplicates, setShowOnlyDuplicates] = useState(true);
  const [enableEyeTracking, setEnableEyeTracking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'comparison' | 'gallery'>('comparison');

  // Add a useEffect to catch any initialization errors
  React.useEffect(() => {
    try {
      console.log('SkinComparisonTool: Initializing...');
      console.log('SKINS available:', !!SKINS);
      console.log('ALL_SKINS available:', !!ALL_SKINS);
    } catch (err) {
      console.error('SkinComparisonTool: Initialization error:', err);
      setError(`Initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Analyze differences between old and new skin definitions
  const analyzeDifferences = (oldSkin: any, newSkin: any): string[] => {
    const differences: string[] = [];
    
    // Compare basic properties
    if (oldSkin.name !== newSkin.name) {
      differences.push(`Name: "${oldSkin.name}" vs "${newSkin.name}"`);
    }
    
    if (oldSkin.tier !== newSkin.tier) {
      differences.push(`Tier: "${oldSkin.tier}" vs "${newSkin.tier}"`);
    }
    
    if (oldSkin.kind !== newSkin.kind) {
      differences.push(`Kind: "${oldSkin.kind}" vs "${newSkin.kind}"`);
    }
    
    // Compare colors
    const oldColors = oldSkin.colors || [];
    const newColors = newSkin.colors || [];
    if (JSON.stringify(oldColors) !== JSON.stringify(newColors)) {
      differences.push(`Colors: [${oldColors.join(', ')}] vs [${newColors.join(', ')}]`);
    }
    
    // Check for new properties in newSkin
    if (newSkin.base && !oldSkin.base) {
      differences.push('New: Has base properties (fill, stroke, shine)');
    }
    
    if (newSkin.pattern && !oldSkin.pattern) {
      differences.push('New: Has pattern definition');
    }
    
    if (newSkin.gradient && !oldSkin.gradient) {
      differences.push('New: Has gradient definition');
    }
    
    return differences;
  };

  // Get complexity metrics for a skin
  const getSkinComplexity = (skin: any): { hasAnimations: boolean, complexity: string, description: string } => {
    const id = skin.id;
    
    // Complex slimes with animations and special effects
    const complexSlimes = {
      'nebula': { hasAnimations: true, complexity: 'Very High', description: 'Swirling cosmic clouds, twinkling starfield' },
      'confetti': { hasAnimations: true, complexity: 'High', description: 'Colorful animated dashed lines' },
      'aurora_veil': { hasAnimations: true, complexity: 'Very High', description: 'Aurora borealis effects, flowing gradients' },
      'lava_flow': { hasAnimations: true, complexity: 'Very High', description: 'Lava bubbles, heat shimmer effects' },
      'ripple': { hasAnimations: true, complexity: 'High', description: 'Concentric animated rings' },
      'phoenix_heart': { hasAnimations: true, complexity: 'Very High', description: 'Fire flicker effects, ember particles' },
      'galaxy_swirl': { hasAnimations: true, complexity: 'Very High', description: 'Galactic spiral, star particles' },
      'star_parade': { hasAnimations: true, complexity: 'High', description: 'Moving star formations' },
      'ionosong': { hasAnimations: true, complexity: 'High', description: 'Electric field effects' },
      'synthwave': { hasAnimations: true, complexity: 'High', description: 'Neon grid animations' },
      'black_ice': { hasAnimations: true, complexity: 'High', description: 'Ice crystal formations' },
      'volcanic_glass': { hasAnimations: true, complexity: 'High', description: 'Glass refraction effects' },
      'thunder_shelf': { hasAnimations: true, complexity: 'High', description: 'Lightning bolt effects' },
      'prism_mist': { hasAnimations: true, complexity: 'High', description: 'Prism light refraction' },
      'sprinkles': { hasAnimations: true, complexity: 'Medium', description: 'Colorful sprinkle particles' },
      'polka_mint': { hasAnimations: false, complexity: 'Medium', description: 'Polka dot pattern' },
      'cotton_candy': { hasAnimations: false, complexity: 'Medium', description: 'Fluffy cotton texture' },
      'rainbow': { hasAnimations: false, complexity: 'Medium', description: 'Rainbow gradient' },
      'sunset': { hasAnimations: false, complexity: 'Medium', description: 'Sunset gradient' },
      'sunrise': { hasAnimations: false, complexity: 'Medium', description: 'Sunrise gradient' }
    };
    
    const slimeInfo = complexSlimes[id];
    if (slimeInfo) {
      return slimeInfo;
    }
    
    // Default complexity based on tier and properties
    if (skin.tier === 'mythic') {
      return { hasAnimations: false, complexity: 'High', description: 'Mythic tier - likely has special effects' };
    } else if (skin.tier === 'epic') {
      return { hasAnimations: false, complexity: 'Medium', description: 'Epic tier - may have patterns' };
    } else {
      return { hasAnimations: false, complexity: 'Low', description: 'Simple design' };
    }
  };

  // Analyze differences between multiple skin variants
  const analyzeMultipleDifferences = (variants: Array<{source: string, skin: any, index: number}>): string[] => {
    const differences: string[] = [];
    
    if (variants.length < 2) return differences;
    
    const firstVariant = variants[0];
    
    // Compare each variant against the first one
    for (let i = 1; i < variants.length; i++) {
      const variant = variants[i];
      const variantDifferences = analyzeDifferences(firstVariant.skin, variant.skin);
      
      if (variantDifferences.length > 0) {
        differences.push(`\n${variant.source} vs ${firstVariant.source}:`);
        differences.push(...variantDifferences.map(diff => `  • ${diff}`));
      }
    }
    
    // Add variant count info
    differences.unshift(`Found ${variants.length} variants across ${new Set(variants.map(v => v.source)).size} systems`);
    
    return differences;
  };

  // Get unified skins for gallery mode
  const unifiedSkins = useMemo(() => {
    try {
      const skins = Object.entries(SKINS || {}).map(([id, skin]) => ({
        id,
        name: skin.name,
        tier: skin.tier,
        kind: skin.kind,
        colors: skin.colors,
        pattern: skin.pattern,
        skin
      }));
      
      // Debug: Log first few skins to see their structure
      console.log('First few unified skins:', skins.slice(0, 3));
      console.log('Sample skin data:', skins[0]?.skin);
      
      // Sort by tier, then by name
      return skins.sort((a, b) => {
        const tierOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, mythic: 4 };
        const tierDiff = tierOrder[a.tier as keyof typeof tierOrder] - tierOrder[b.tier as keyof typeof tierOrder];
        if (tierDiff !== 0) return tierDiff;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('Error loading unified skins:', error);
      return [];
    }
  }, []);

  // Find duplicate skins across all systems
  const duplicateSkins = useMemo(() => {
    try {
      const duplicates: DuplicateSkin[] = [];

      // Get consolidated skin IDs from unified-skins.ts
      const consolidatedSkinIds = new Set(Object.keys(SKINS || {}));
      console.log('SKINS loaded:', Object.keys(SKINS || {}).length, 'skins');
      console.log('Consolidated skin IDs:', Array.from(consolidatedSkinIds).slice(0, 10), '...');

      // Get skins marked for removal from choice files
      const removedSkinIds = new Set<string>();
      // Note: In browser environment, we can't read choice files directly
      // This filtering will be handled after the file swap migration
      console.log('Skins marked for removal: 0 (browser environment)');
      console.log('Sample removed skins: [] (browser environment)');
      
      // Collect all skins by ID
      const skinMap = new Map<string, Array<{source: string, skin: any, index: number}>>();
      
      // Add skins from old system
      Object.entries(SKINS || {}).forEach(([id, skin], index) => {
        if (!skinMap.has(id)) skinMap.set(id, []);
        skinMap.get(id)!.push({ source: 'skins.ts', skin, index });
      });
      
      // Add skins from new system
      (ALL_SKINS || []).forEach((skin, index) => {
        if (!skinMap.has(skin.id)) skinMap.set(skin.id, []);
        skinMap.get(skin.id)!.push({ source: 'all-skins.ts', skin, index });
      });
      
          // Find skins with multiple variants, but exclude already consolidated ones AND removed ones
          let totalDuplicates = 0;
          let filteredDuplicates = 0;

          for (const [id, variants] of skinMap.entries()) {
            if (variants.length > 1) {
              totalDuplicates++;
              if (!consolidatedSkinIds.has(id) && !removedSkinIds.has(id)) {
                filteredDuplicates++;
                const differences = analyzeMultipleDifferences(variants);
                duplicates.push({
                  id,
                  name: variants[0].skin.name,
                  variants,
                  differences
                });
              }
            }
          }
      
      console.log(`Duplicate filtering: ${totalDuplicates} total duplicates, ${filteredDuplicates} after filtering`);
      console.log('Remaining duplicates:', duplicates.map(d => d.id).slice(0, 10), '...');
      
      return duplicates;
    } catch (error) {
      console.error('Error finding duplicate skins:', error);
      setError(`Failed to load skin data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }, []);

  const currentDuplicate = duplicateSkins[currentIndex];
  const currentChoice = choices[currentDuplicate?.id];

  const handleChoice = (choice: ComparisonChoice) => {
    if (!currentDuplicate) return;
    
    setChoices(prev => ({
      ...prev,
      [currentDuplicate.id]: {
        skinId: currentDuplicate.id,
        choice,
        notes: prev[currentDuplicate.id]?.notes
      }
    }));
  };

  const handleNotesChange = (notes: string) => {
    if (!currentDuplicate) return;
    
    setChoices(prev => ({
      ...prev,
      [currentDuplicate.id]: {
        skinId: currentDuplicate.id,
        choice: prev[currentDuplicate.id]?.choice || "old",
        notes
      }
    }));
  };

  const exportChoices = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalDuplicates: duplicateSkins.length,
      choices: choices,
      summary: {
        old: Object.values(choices).filter(c => c.choice === "old").length,
        new: Object.values(choices).filter(c => c.choice === "new").length,
        merge: Object.values(choices).filter(c => c.choice.includes("merge")).length
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skin-comparison-choices-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Comparison Tool</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reload Page
        </button>
      </div>
    );
  }

  // Only show "no duplicates" message if we're in comparison mode and there are no duplicates
  if (duplicateSkins.length === 0 && viewMode === 'comparison') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Enhanced Skin Comparison Tool</h1>
          <p className="text-gray-600">No duplicate skins found between old and new systems</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">View Mode:</label>
            <select 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value as any)}
              className="px-3 py-1 border rounded"
            >
              <option value="comparison">Comparison Tool</option>
              <option value="gallery">Unified Gallery</option>
            </select>
          </div>
        </div>

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No Duplicate Skins Found</h2>
          <p className="text-gray-600 mb-4">All skins in both systems have unique IDs.</p>
          <p className="text-sm text-gray-500">Switch to "Unified Gallery" mode to view all consolidated skins.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {viewMode === 'comparison' ? 'Enhanced Skin Comparison Tool' : 'Unified Skin Gallery'}
        </h1>
        <p className="text-gray-600">
          {viewMode === 'comparison' 
            ? `Found ${duplicateSkins.length} duplicate skins between old and new systems`
            : `Showing ${unifiedSkins.length} consolidated skins from unified system`
          }
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">View Mode:</label>
          <select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value as any)}
            className="px-3 py-1 border rounded"
          >
            <option value="comparison">Comparison Tool</option>
            <option value="gallery">Unified Gallery</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Preview Context:</label>
          <select 
            value={previewContext} 
            onChange={(e) => setPreviewContext(e.target.value as any)}
            className="px-3 py-1 border rounded"
          >
            <option value="thumbnail">Thumbnail</option>
            <option value="in-play">In-Play</option>
            <option value="gallery">Gallery</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Biome Background:</label>
          <select 
            value={biomeBackground} 
            onChange={(e) => setBiomeBackground(e.target.value as any)}
            className="px-3 py-1 border rounded"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="meadow">Meadow</option>
            <option value="beach">Beach</option>
            <option value="forest">Forest</option>
            <option value="desert">Desert</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Eye Tracking:</label>
          <input
            type="checkbox"
            checked={enableEyeTracking}
            onChange={(e) => setEnableEyeTracking(e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Progress:</label>
          <span className="text-sm">
            {Object.keys(choices).length} / {duplicateSkins.length} completed
          </span>
        </div>

        <button
          onClick={exportChoices}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export Choices
        </button>
      </div>

      {/* Gallery Mode */}
      {viewMode === 'gallery' && (
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {unifiedSkins.map((skin, index) => (
              <div key={skin.id} className="bg-white rounded-lg shadow-md p-4 border">
                <div className="aspect-square mb-3 relative" style={{ backgroundColor: BIOME_BACKGROUNDS[biomeBackground] }}>
                  <UnifiedSlimeRenderer
                    skinData={skin.skin}
                    source="old"
                    className={`w-${previewContext === 'thumbnail' ? '16' : previewContext === 'in-play' ? '24' : '32'} h-${previewContext === 'thumbnail' ? '16' : previewContext === 'in-play' ? '24' : '32'}`}
                    eyeTracking={enableEyeTracking}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-sm mb-1">{skin.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      skin.tier === 'common' ? 'bg-gray-100 text-gray-800' :
                      skin.tier === 'uncommon' ? 'bg-green-100 text-green-800' :
                      skin.tier === 'rare' ? 'bg-blue-100 text-blue-800' :
                      skin.tier === 'epic' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {skin.tier}
                    </span>
                    <span className="text-gray-500">{skin.kind}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Skin Comparison */}
      {viewMode === 'comparison' && currentDuplicate && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{currentDuplicate.name}</h2>
            <div className="text-sm text-gray-600">
              {currentIndex + 1} of {duplicateSkins.length}
            </div>
          </div>

          {/* Differences Summary */}
          {currentDuplicate.differences.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-medium text-yellow-800 mb-2">Key Differences:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                {currentDuplicate.differences.map((diff, i) => (
                  <li key={i}>• {diff}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Multi-Variant Comparison */}
          <div className={`grid gap-6 mb-6 ${currentDuplicate.variants.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'}`}>
            {currentDuplicate.variants.map((variant, index) => (
              <div key={`${variant.source}-${index}`} className="border rounded-lg p-4">
                <h3 className={`text-lg font-semibold mb-3 ${
                  variant.source === 'skins.ts' ? 'text-blue-600' : 
                  variant.source === 'all-skins.ts' ? 'text-green-600' : 
                  'text-purple-600'
                }`}>
                  {variant.source} {currentDuplicate.variants.length > 2 ? `(Variant ${index + 1})` : ''}
                </h3>
                <div 
                  className="flex justify-center items-center p-8 rounded"
                  style={{ backgroundColor: BIOME_BACKGROUNDS[biomeBackground] }}
                >
                  <UnifiedSlimeRenderer 
                    skinData={variant.skin}
                    source={variant.source === 'skins.ts' ? 'old' : 'new'}
                    className={`w-${previewContext === 'thumbnail' ? '16' : previewContext === 'in-play' ? '24' : '32'} h-${previewContext === 'thumbnail' ? '16' : previewContext === 'in-play' ? '24' : '32'}`}
                    eyeTracking={enableEyeTracking}
                  />
                </div>
                <div className="mt-3 text-sm space-y-1">
                  <p><strong>ID:</strong> {variant.skin.id}</p>
                  <p><strong>Tier:</strong> {variant.skin.tier}</p>
                  {(() => {
                    const complexity = getSkinComplexity(variant.skin);
                    return (
                      <>
                        <p><strong>Complexity:</strong> <span className={`font-semibold ${
                          complexity.complexity === 'Very High' ? 'text-red-600' :
                          complexity.complexity === 'High' ? 'text-orange-600' :
                          complexity.complexity === 'Medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>{complexity.complexity}</span></p>
                        <p><strong>Has Animations:</strong> <span className={complexity.hasAnimations ? 'text-green-600 font-semibold' : 'text-gray-500'}>{complexity.hasAnimations ? 'Yes' : 'No'}</span></p>
                        <p><strong>Description:</strong> <span className="text-gray-600 italic">{complexity.description}</span></p>
                      </>
                    );
                  })()}
                  {variant.skin.source && <p><strong>Source:</strong> {variant.skin.source}</p>}
                  {variant.skin.kind && <p><strong>Kind:</strong> {variant.skin.kind}</p>}
                  {variant.skin.colors && <p><strong>Colors:</strong> {variant.skin.colors.join(', ')}</p>}
                  {variant.skin.direction && <p><strong>Direction:</strong> {variant.skin.direction}</p>}
                  {variant.skin.base && (
                    <div>
                      <p><strong>Base:</strong></p>
                      <ul className="ml-4 text-xs">
                        <li>Fill: {variant.skin.base.fill}</li>
                        <li>Stroke: {variant.skin.base.stroke}</li>
                        <li>Shine: {variant.skin.base.shine}</li>
                      </ul>
                    </div>
                  )}
                  {variant.skin.pattern && <p><strong>Pattern:</strong> Has pattern definition</p>}
                  {variant.skin.gradient && <p><strong>Gradient:</strong> Has gradient definition</p>}
                  {variant.skin.origin && <p><strong>Origin:</strong> {variant.skin.origin.displayName}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Choice Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3">Choose Design:</h3>
            <div className={`grid gap-3 ${currentDuplicate.variants.length === 2 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {currentDuplicate.variants.map((variant, index) => (
                <button
                  key={`variant-${index}`}
                  onClick={() => handleChoice(`variant-${index}` as any)}
                  className={`p-3 border rounded text-center ${
                    currentChoice?.choice === `variant-${index}` 
                      ? "border-blue-500 bg-blue-50 text-blue-700" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="font-medium">Keep {variant.source}</div>
                  <div className="text-sm text-gray-600">
                    {currentDuplicate.variants.length > 2 ? `Variant ${index + 1}` : 'Use this version'}
                  </div>
                </button>
              ))}
              
              {currentDuplicate.variants.length === 2 && (
                <>
                  <button
                    onClick={() => handleChoice("merge:base=old+readability=new")}
                    className={`p-3 border rounded text-center ${
                      currentChoice?.choice === "merge:base=old+readability=new" 
                        ? "border-purple-500 bg-purple-50 text-purple-700" 
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium">Merge A</div>
                    <div className="text-sm text-gray-600">Old base + New readability</div>
                  </button>
                  
                  <button
                    onClick={() => handleChoice("merge:base=new+readability=old")}
                    className={`p-3 border rounded text-center ${
                      currentChoice?.choice === "merge:base=new+readability=old" 
                        ? "border-purple-500 bg-purple-50 text-purple-700" 
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium">Merge B</div>
                    <div className="text-sm text-gray-600">New base + Old readability</div>
                  </button>
                </>
              )}
              
              {/* None of these option */}
              <button
                onClick={() => handleChoice("none")}
                className={`p-3 border rounded text-center ${
                  currentChoice?.choice === "none" 
                    ? "border-red-500 bg-red-50 text-red-700" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="font-medium">None of these</div>
                <div className="text-sm text-gray-600">Create new design later</div>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Notes (optional):</label>
            <textarea
              value={currentChoice?.notes || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="w-full p-3 border rounded resize-none"
              rows={2}
              placeholder="Add any notes about this choice..."
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={() => setCurrentIndex(Math.min(duplicateSkins.length - 1, currentIndex + 1))}
              disabled={currentIndex === duplicateSkins.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Progress Summary - Only show in comparison mode */}
      {viewMode === 'comparison' && (
        <div className="mt-8 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Progress Summary</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium text-blue-600">Keep Old</div>
              <div>{Object.values(choices).filter(c => c.choice === "old").length}</div>
            </div>
            <div>
              <div className="font-medium text-green-600">Keep New</div>
              <div>{Object.values(choices).filter(c => c.choice === "new").length}</div>
            </div>
            <div>
              <div className="font-medium text-purple-600">Merge</div>
              <div>{Object.values(choices).filter(c => c.choice.includes("merge")).length}</div>
            </div>
            <div>
              <div className="font-medium text-gray-600">Remaining</div>
              <div>{duplicateSkins.length - Object.keys(choices).length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
