// 🍓 Healing Garden - Type Definitions

export type PlantType = 'carrot' | 'turnip' | 'strawberry' | 'watermelon' | 'peach' | 'grape' | 'apple';

export type AnimalType = 'rabbit' | 'turtle' | 'hedgehog' | 'raccoon' | 'frog';

export type PlantStage = 0 | 1 | 2 | 3; // 씨앗, 새싹, 꽃, 과일

export type Rarity = 'common' | 'rare' | 'epic';

export interface Plant {
  id: string;
  slotIndex: number; // 그리드 위치 (0-8)
  type: PlantType;
  stage: PlantStage;
  plantedAt: Date;
  lastWatered: Date | null;
  waterCount: number;
}

export interface SeedItem {
  type: PlantType;
  count: number; // -1 = 무제한
}

export interface PlantConfig {
  type: PlantType;
  name: string;
  seedPrice: number;
  harvestGold: number;
  growthTime: number; // 분 단위
  waterBonus: number; // 물 1회당 단축 시간 (분)
  emoji: string; // 임시 비주얼
  rarity: Rarity;
}

export interface AnimalVisitor {
  type: AnimalType;
  appearedAt: Date;
}

export interface GardenState {
  plants: Plant[];
  seeds: SeedItem[]; // 씨앗 가방
  level: number;
  gold: number;
  water: number; // 물방울 (최대 5, 2시간마다 1개 충전)
  lastWaterRechargeTime: Date; // 마지막 물 충전 시간
  collection: PlantType[];
  seenCollection: PlantType[]; // 도감에서 확인한 수집 목록
  visitors: AnimalVisitor[]; // 정원에 방문한 동물들
  claimedAnimals: AnimalType[]; // 선물을 받은 동물들
  soundEnabled: boolean; // 소리/진동 설정
  notificationEnabled: boolean; // 알림 설정
  lastSaveTime: Date;
}

