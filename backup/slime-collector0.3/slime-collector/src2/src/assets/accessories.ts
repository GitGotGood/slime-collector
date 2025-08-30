// Registry only for now — UI renderers can come later.

export type AccessorySlot = 'hat' | 'eyes' | 'mouth' | 'aura' | 'trail';

export interface AccessoryDef {
  id: string;
  slot: AccessorySlot;
  name: string;
  rarity: 'common'|'uncommon'|'rare'|'epic'|'mythic';
  // future: svg render function or css classes
}

export const ACCESSORIES: AccessoryDef[] = [
  { id: 'hat_crown',      slot: 'hat',   name: 'Royal Crown',     rarity: 'epic' },
  { id: 'hat_beanie',     slot: 'hat',   name: 'Cozy Beanie',     rarity: 'uncommon' },
  { id: 'eyes_supercute', slot: 'eyes',  name: 'Super Cute Eyes', rarity: 'uncommon' },
  { id: 'eyes_angry',     slot: 'eyes',  name: 'Angry Eyes',      rarity: 'rare' },
  { id: 'mouth_bigsmile', slot: 'mouth', name: 'Big Smile',       rarity: 'common' },
  { id: 'mouth_fangs',    slot: 'mouth', name: 'Fangs',           rarity: 'rare' },
  { id: 'aura_halo',      slot: 'aura',  name: 'Halo',            rarity: 'rare' },
  { id: 'trail_sparkle',  slot: 'trail', name: 'Sparkle Trail',   rarity: 'mythic' },
];



