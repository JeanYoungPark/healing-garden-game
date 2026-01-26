// 🌱 Healing Garden - Plant Configurations

import { PlantConfig, PlantType } from '../types';

export const PLANT_CONFIGS: Record<PlantType, PlantConfig> = {
  rose: {
    type: 'rose',
    name: '장미',
    seedPrice: 10,
    harvestGold: 30,
    growthTime: 180, // 3시간
    emoji: '🌹',
    rarity: 'common',
  },
  sunflower: {
    type: 'sunflower',
    name: '해바라기',
    seedPrice: 25,
    harvestGold: 80,
    growthTime: 180,
    emoji: '🌻',
    rarity: 'common',
  },
  tulip: {
    type: 'tulip',
    name: '튤립',
    seedPrice: 50,
    harvestGold: 150,
    growthTime: 180,
    emoji: '🌷',
    rarity: 'rare',
  },
  lavender: {
    type: 'lavender',
    name: '라벤더',
    seedPrice: 100,
    harvestGold: 320,
    growthTime: 240, // 4시간
    emoji: '💜',
    rarity: 'rare',
  },
  cherry: {
    type: 'cherry',
    name: '벚꽃',
    seedPrice: 200,
    harvestGold: 700,
    growthTime: 300, // 5시간
    emoji: '🌸',
    rarity: 'epic',
  },
};

// 성장 시간 계산 헬퍼
export const GROWTH_STAGE_DURATION = 60; // 각 단계당 60분

// 물 효과 (25% 가속)
export const WATER_BONUS = 0.25;
export const MAX_WATER_PER_DAY = 3;
