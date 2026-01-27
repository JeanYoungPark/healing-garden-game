// 🍓 Healing Garden - Type Definitions

export type PlantType = 'strawberry' | 'watermelon' | 'peach' | 'grape' | 'apple';

export type PlantStage = 0 | 1 | 2 | 3; // 씨앗, 새싹, 꽃, 과일

export type Rarity = 'common' | 'rare' | 'epic';

export interface Plant {
  id: string;
  position: { x: number; y: number }; // 화면 상의 절대 좌표
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
  level: number;
  gold: number;
  tickets: number;
  collection: PlantType[];
  lastSaveTime: Date;
}

export interface Decoration {
  id: string;
  type: string;
  position: { x: number; y: number };
}
