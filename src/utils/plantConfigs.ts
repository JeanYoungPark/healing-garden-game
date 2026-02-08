// 🍓 Healing Garden - Fruit Configurations

import { PlantConfig, PlantType } from '../types';

export const PLANT_CONFIGS: Record<PlantType, PlantConfig> = {
  carrot: {
    type: 'carrot',
    name: '당근',
    seedPrice: 0,
    harvestGold: 50,
    growthTime: 30, // 30분
    waterBonus: 3, // 물 1회당 3분 단축
    emoji: '🥕',
    rarity: 'common',
  },
  strawberry: {
    type: 'strawberry',
    name: '딸기',
    seedPrice: 10,
    harvestGold: 30,
    growthTime: 180, // 3시간
    waterBonus: 18, // 물 1회당 18분 단축
    emoji: '🍓',
    rarity: 'common',
  },
  watermelon: {
    type: 'watermelon',
    name: '수박',
    seedPrice: 25,
    harvestGold: 80,
    growthTime: 180,
    waterBonus: 18,
    emoji: '🍉',
    rarity: 'common',
  },
  peach: {
    type: 'peach',
    name: '복숭아',
    seedPrice: 50,
    harvestGold: 150,
    growthTime: 180,
    waterBonus: 20,
    emoji: '🍑',
    rarity: 'rare',
  },
  grape: {
    type: 'grape',
    name: '포도',
    seedPrice: 100,
    harvestGold: 320,
    growthTime: 240, // 4시간
    waterBonus: 25,
    emoji: '🍇',
    rarity: 'rare',
  },
  apple: {
    type: 'apple',
    name: '사과',
    seedPrice: 200,
    harvestGold: 700,
    growthTime: 300, // 5시간
    waterBonus: 30,
    emoji: '🍎',
    rarity: 'epic',
  },
};
