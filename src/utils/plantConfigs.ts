// 🍓 Healing Garden - Fruit Configurations

import { PlantConfig, PlantType } from '../types';

export const PLANT_CONFIGS: Record<PlantType, PlantConfig> = {
  carrot: {
    type: 'carrot',
    name: '당근',
    seedPrice: 0,
    harvestGold: 50,
    growthTime: 15, // 15분
    waterBonus: 1.5, // 물 1회당 1.5분 단축
    emoji: '🥕',
    rarity: 'common',
    description: '밝은 주황빛의 건강한 채소예요.',
    story: '첫 번째 당근을 수확했을 때 토끼가 찾아왔어요.',
    collectionImage: require('../assets/collection/plant-carrot.png'),
    collectionShadow: require('../assets/collection/plant-shadow-carrot.png'),
  },
  turnip: {
    type: 'turnip',
    name: '무',
    seedPrice: 0, // 동물 선물로만 획득
    harvestGold: 80,
    growthTime: 30, // 30분
    waterBonus: 3, // 물 1회당 3분 단축
    emoji: '🥬',
    rarity: 'common',
    description: '첫 방문 기념으로 받은 소중한 씨앗이에요.',
    story: '하얀 속살이 아삭아삭한 채소예요.',
    collectionImage: require('../assets/collection/plant-turnip.png'),
    collectionShadow: require('../assets/collection/plant-shadow-turnip.png'),
  },
  potato: {
    type: 'potato',
    name: '감자',
    seedPrice: 0, // 동물 선물로만 획득
    harvestGold: 200,
    growthTime: 120, // 2시간
    waterBonus: 6, // 물 1회당 6분 단축
    emoji: '🥔',
    rarity: 'common',
    description: '포슬포슬한 노란 속살의 채소예요.',
    story: '부기가 먼 길을 오며 가져온 씨앗이에요.',
    collectionImage: require('../assets/collection/plant-potato.png'),
    collectionShadow: require('../assets/collection/plant-shadow-potato.png'),
  },
  strawberry: {
    type: 'strawberry',
    name: '딸기',
    seedPrice: 10,
    harvestGold: 30,
    growthTime: 45, // 45분
    waterBonus: 4.5, // 물 1회당 4.5분 단축
    emoji: '🍓',
    rarity: 'common',
    description: '작고 빨간 봄의 선물이에요.',
    story: '달콤한 향기가 정원을 가득 채워요.',
    collectionImage: require('../assets/collection/plant-strawberry.png'),
    collectionShadow: require('../assets/collection/plant-shadow-strawberry.png'),
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
    collectionImage: require('../assets/collection/plant-apple.png'),
    collectionShadow: require('../assets/collection/plant-shadow-apple.png'),
  },
  eggplant: {
    type: 'eggplant',
    name: '가지',
    seedPrice: 150,
    harvestGold: 500,
    growthTime: 270, // 4시간 30분
    waterBonus: 28,
    emoji: '🍆',
    rarity: 'epic',
    description: '윤기 나는 보랏빛 채소예요.',
    story: '정원에 고귀한 빛깔이 더해졌어요.',
    collectionImage: require('../assets/collection/plant-eggplant.png'),
    collectionShadow: require('../assets/collection/plant-shadow-eggplant.png'),
  },
};

// config에서 자동 파생된 작물 목록 (도감 등에서 사용)
export const ALL_PLANT_TYPES = Object.keys(PLANT_CONFIGS) as PlantType[];
