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
    description: '밝은 주황빛의 건강한 채소예요.',
    story: '첫 번째 당근을 수확했을 때 토끼가 찾아왔어요.',
  },
  turnip: {
    type: 'turnip',
    name: '무',
    seedPrice: 0, // 동물 선물로만 획득
    harvestGold: 80,
    growthTime: 60, // 1시간
    waterBonus: 6, // 물 1회당 6분 단축
    emoji: '🥬',
    rarity: 'common',
    description: '하얀 속살이 아삭한 채소예요.',
    story: '토끼가 선물해준 소중한 씨앗이에요.',
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
    description: '작고 빨간 봄의 선물이에요.',
    story: '달콤한 향기가 정원을 가득 채워요.',
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
    description: '시원하고 달콤한 여름 과일이에요.',
    story: '더운 날 먹으면 기분이 좋아져요.',
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
    description: '부드러운 솜털과 달콤한 과즙이 일품이에요.',
    story: '복숭아향이 정원에 은은하게 퍼져요.',
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
    description: '알알이 모여 영롱한 보랏빛을 띠어요.',
    story: '한 알 한 알이 정성으로 자랐어요.',
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
    description: '빛나는 붉은 빛의 특별한 과일이에요.',
    story: '정원에서 가장 귀한 보석 같은 존재예요.',
  },
};
