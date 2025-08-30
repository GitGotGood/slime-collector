import type { SkillID } from './types';

export type BiomeNodeID = 
  | 'meadow' | 'beach' | 'forest' | 'desert' | 'cove' | 'tundra' 
  | 'canyon' | 'aurora' | 'savanna' | 'glacier' | 'volcano' | 'reef' 
  | 'temple' | 'harbor' | 'observatory' | 'foundry';

export type MapNode = {
  id: BiomeNodeID;
  title: string;
  pos: { x: number; y: number }; // normalized 0..100 vw/vh
  primarySkill: SkillID;         // main gate
  skills: SkillID[];             // other skills available in that biome
  requires: BiomeNodeID[];       // prerequisites
  reward: { biomeUnlock: BiomeNodeID; shopBiasDays?: number; };
  color: string;                 // primary color for the node
  description: string;           // flavor text
};

export type BiomeProgress = {
  [biome in BiomeNodeID]?: {
    stars: 0 | 1 | 2 | 3;         // based on accuracy/time gates
    placedUnlock?: boolean;       // gained via placement check
    masteredAt?: string;          // ISO date
  };
};

// Initial proof of concept map layout
export const MAP: MapNode[] = [
  {
    id: 'meadow',
    title: 'Meadow',
    pos: { x: 15, y: 75 },
    primarySkill: 'add_1_10',
    skills: ['add_1_10', 'add_1_20'],
    requires: [],
    reward: { biomeUnlock: 'meadow', shopBiasDays: 7 },
    color: '#22c55e',
    description: 'A peaceful grassland where slimes first learn to add. The perfect place to start your mathematical journey!'
  },
  {
    id: 'beach',
    title: 'Sunny Beach',
    pos: { x: 35, y: 70 },
    primarySkill: 'add_1_20',
    skills: ['add_1_20', 'sub_1_10'],
    requires: ['meadow'],
    reward: { biomeUnlock: 'beach', shopBiasDays: 7 },
    color: '#06b6d4',
    description: 'Warm sandy shores where advanced addition meets the first hints of subtraction.'
  },
  {
    id: 'forest',
    title: 'Mystic Forest',
    pos: { x: 25, y: 50 },
    primarySkill: 'sub_1_10',
    skills: ['sub_1_10', 'sub_1_20'],
    requires: ['beach'],
    reward: { biomeUnlock: 'forest', shopBiasDays: 7 },
    color: '#059669',
    description: 'Ancient trees hide the secrets of subtraction. Wise owl slimes guide young mathematicians.'
  },
  {
    id: 'desert',
    title: 'Golden Desert',
    pos: { x: 55, y: 45 },
    primarySkill: 'sub_1_20',
    skills: ['sub_1_20', 'mul_0_5_10'],
    requires: ['forest'],
    reward: { biomeUnlock: 'desert', shopBiasDays: 7 },
    color: '#f59e0b',
    description: 'Scorching sands where subtraction mastery leads to the first multiplication oasis.'
  },
  {
    id: 'cove',
    title: 'Crystal Cove',
    pos: { x: 75, y: 35 },
    primarySkill: 'mul_0_5_10',
    skills: ['mul_0_5_10', 'mul_0_10'],
    requires: ['desert'],
    reward: { biomeUnlock: 'cove', shopBiasDays: 7 },
    color: '#3b82f6',
    description: 'Hidden caves filled with crystalline slimes who multiply numbers like magic.'
  },
  {
    id: 'tundra',
    title: 'Frozen Tundra',
    pos: { x: 65, y: 20 },
    primarySkill: 'mul_0_10',
    skills: ['mul_0_10', 'div_facts'],
    requires: ['cove'],
    reward: { biomeUnlock: 'tundra', shopBiasDays: 7 },
    color: '#8b5cf6',
    description: 'Icy peaks where multiplication reaches its peak, preparing for the mysteries of division.'
  },
  {
    id: 'aurora',
    title: 'Aurora Plains',
    pos: { x: 45, y: 15 },
    primarySkill: 'div_facts',
    skills: ['div_facts'],
    requires: ['tundra'],
    reward: { biomeUnlock: 'aurora', shopBiasDays: 7 },
    color: '#ec4899',
    description: 'Where the northern lights dance, division facts illuminate the path to mathematical mastery.'
  },
  {
    id: 'observatory',
    title: 'Sky Observatory',
    pos: { x: 25, y: 10 },
    primarySkill: 'order_ops',
    skills: ['order_ops', 'powers10'],
    requires: ['aurora'],
    reward: { biomeUnlock: 'observatory', shopBiasDays: 7 },
    color: '#6366f1',
    description: 'The highest peak where all mathematical skills unite under the stars. True masters dwell here.'
  }
];

// Helper functions
export function getNodeById(id: BiomeNodeID): MapNode | undefined {
  return MAP.find(node => node.id === id);
}

export function getUnlockedNodes(progress: BiomeProgress): BiomeNodeID[] {
  return MAP.filter(node => {
    if (node.requires.length === 0) return true; // Always unlock first node
    return node.requires.some(req => progress[req] && progress[req]!.stars > 0);
  }).map(node => node.id);
}

export function getNodeProgress(nodeId: BiomeNodeID, progress: BiomeProgress) {
  return progress[nodeId] || { stars: 0 };
}

export function canAccessNode(nodeId: BiomeNodeID, progress: BiomeProgress): boolean {
  const node = getNodeById(nodeId);
  if (!node) return false;
  if (node.requires.length === 0) return true;
  return node.requires.every(req => progress[req] && progress[req]!.stars > 0);
}
