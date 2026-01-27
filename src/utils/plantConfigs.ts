// 🍓 Healing Garden - Fruit Configurations

import { PlantConfig, PlantType } from '../types';

export const PLANT_CONFIGS: Record<PlantType, PlantConfig> = {
  strawberry: {
    type: 'strawberry',
    name: '딸기',
    seedPrice: 10,
    harvestGold: 30,
    growthTime: 180, // 3시간
    emoji: '🍓',
    rarity: 'common',
  },
  watermelon: {
    type: 'watermelon',
    name: '수박',
    seedPrice: 25,
    harvestGold: 80,
    growthTime: 180,
    emoji: '🍉',
    rarity: 'common',
  },
  peach: {
    type: 'peach',
    name: '복숭아',
    seedPrice: 50,
    harvestGold: 150,
    growthTime: 180,
    emoji: '🍑',
    rarity: 'rare',
  },
  grape: {
    type: 'grape',
    name: '포도',
    seedPrice: 100,
    harvestGold: 320,
    growthTime: 240, // 4시간
    emoji: '🍇',
    rarity: 'rare',
  },
  apple: {
    type: 'apple',
    name: '사과',
    seedPrice: 200,
    harvestGold: 700,
    growthTime: 300, // 5시간
    emoji: '🍎',
    rarity: 'epic',
  },
};

// 성장 시간 계산 헬퍼
export const GROWTH_STAGE_DURATION = 60; // 각 단계당 60분

// 물 효과 (25% 가속)
export const WATER_BONUS = 0.25;
export const MAX_WATER_PER_DAY = 3;
