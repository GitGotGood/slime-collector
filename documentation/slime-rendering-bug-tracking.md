# Slime Rendering Bug Tracking

## Issue: SVG Rendering Errors with Pattern Skins

**Date Created:** 2025-01-19  
**Status:** 🔴 ACTIVE - Not Resolved  
**Affected Skins:** Sprinkles, Polka Mint  

### Problem Description

Massive SVG rendering errors occur when using pattern-based skins, specifically:
- Hundreds of `Error: <circle> attribute cy: Expected length, "undefined"` errors
- Hundreds of `Error: <rect> attribute height: Expected length, "undefined"` errors  
- Hundreds of `Error: <ellipse> attribute cy: Expected length, "undefined"` errors
- Hundreds of `Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "undefined"` errors

### Symptoms Observed

1. **Sprinkles Skin:**
   - Keeps texture but reverts to default green slime body fill
   - Eyes and mouth revert to default green
   - Static, non-mouse-tracking eyes appear behind the green eyes
   - Pattern colors are available: `patternColors: Array(4)`

2. **Polka Mint Skin:**
   - Similar rendering issues
   - Pattern colors are missing: `patternColors: undefined`
   - Has `pattern.color: "#FFFFFF"` instead of `pattern.colors` array

### Root Cause Analysis

**Identified Issue:** Inconsistent pattern data structures between skins:
- **Sprinkles**: `pattern.colors: Array(4)` (multi-color)
- **Polka Mint**: `pattern.color: "#FFFFFF"` (single color)

**Pattern Definitions:**
```typescript
// Sprinkles (working colors)
pattern: { 
  type: "confetti_dots", 
  count: 18, 
  colors: ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA"], 
  alpha: 0.50 
}

// Polka Mint (missing colors array)
pattern: { 
  type: "polka_dots", 
  size: 3, 
  spacing: 12, 
  color: "#FFFFFF", 
  alpha: 0.14 
}
```

### Attempted Fixes

#### Fix 1: Pattern Color Handling ✅
- **Date:** 2025-01-19
- **Action:** Updated pattern rendering logic to handle both `colors` array and `color` string
- **Code:** `(skin.pattern as any)?.colors?.[i] || (skin.pattern as any)?.color || "#10B981"`
- **Result:** ❌ Still not working

#### Fix 2: Polka Mint Pattern Logic ✅  
- **Date:** 2025-01-19
- **Action:** Replaced hardcoded colors with pattern properties
- **Code:** Uses `pattern.color` and `pattern.alpha` from skin definition
- **Result:** ❌ Still not working

#### Fix 3: Eye Rendering Optimization ✅
- **Date:** 2025-01-19  
- **Action:** Wrapped eye rendering in `useMemo` to prevent excessive re-renders
- **Result:** ✅ Reduced eye rendering calls from 110+ to 2, but SVG errors persist

#### Fix 4: Null Safety for EyeOffset ✅
- **Date:** 2025-01-19
- **Action:** Added null checks for `eyeOffset` properties using `?.` and `|| 0`
- **Result:** ❌ SVG errors still occurring

### Current Status

**Last Test:** 2025-01-19  
**Dev Server:** Running on http://localhost:5175/  
**Error Count:** Still hundreds of SVG attribute errors  
**User Report:** "It's not fixed..."

### Next Investigation Steps

1. **Check if errors are coming from other pattern skins** - Test all pattern-based skins
2. **Investigate SVG attribute calculation** - Look for other sources of `undefined` values
3. **Check pattern rendering logic** - Verify all pattern types are handled correctly
4. **Test with different skins** - See if issue is specific to certain skins or all patterns
5. **Console debugging** - Add more targeted debugging to identify exact source of `undefined` attributes

### Debugging Commands Used

```bash
# Pattern debugging added to Slime.tsx
console.log("🎨 SPRINKLES PATTERN DEBUG:", { 
  id, 
  skinPattern: skin.pattern, 
  patternColors: (skin.pattern as any)?.colors,
  patternType: (skin.pattern as any)?.type 
});

console.log("🎨 POLKA MINT PATTERN DEBUG:", { 
  id, 
  skinPattern: skin.pattern, 
  patternColors: (skin.pattern as any)?.colors,
  patternType: (skin.pattern as any)?.type 
});
```

### Files Modified

- `src/ui/components/Slime.tsx` - Pattern rendering logic, eye rendering optimization, null safety
- `src/assets/all-skins.ts` - Skin definitions (no changes needed)

### Related Issues

- React Strict Mode causing double rendering in development
- Profile loading issues (resolved separately)
- Eye tracking and mouse interaction (partially resolved)

---

**Last Updated:** 2025-01-19  
**Next Action:** Continue investigation into SVG attribute sources
