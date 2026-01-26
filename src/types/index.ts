// 🌱 Healing Garden - Type Definitions

export type PlantType = 'rose' | 'sunflower' | 'tulip' | 'lavender' | 'cherry';

export type PlantStage = 0 | 1 | 2 | 3; // 씨앗, 새싹, 성장, 개화

export type Rarity = 'common' | 'rare' | 'epic';

export interface Plant {
  id: string;
  slotIndex: number;
  type: PlantType;
  stage: PlantStage;
  plantedAt: Date;
  lastWatered: Date | null;
  waterCount: number;
}

export interface PlantConfig {
  type: PlantType;
  name: string;
  seedPrice: number;
  harvestGold: number;
  growthTime: number; // 분 단위
  emoji: string; // 임시 비주얼
  rarity: Rarity;
}

export interface GardenState {
  plants: Plant[];
  gridSize: 3 | 4 | 5;
  gold: number;
  collection: PlantType[];
  lastSaveTime: Date;
}

export interface Decoration {
  id: string;
  type: string;
  position: { x: number; y: number };
}
