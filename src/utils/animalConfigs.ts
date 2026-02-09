// 🐰 Healing Garden - Animal Configurations

import { AnimalType, PlantType } from '../types';

export interface AnimalConfig {
  type: AnimalType;
  name: string;        // 표시 이름
  nickname: string;    // 별명 (알럿용)
  emoji: string;
  giftSeedType: PlantType;  // 선물로 주는 씨앗
  giftSeedCount: number;
  giftMessage: string;      // 선물 알럿 메시지
  // 등장 조건
  trigger: {
    type: 'harvest';         // 특정 작물 수확 후 등장
    requiredPlant: PlantType;
  } | {
    type: 'random';          // 랜덤 등장 (추후 구현)
  };
}

export const ANIMAL_CONFIGS: Record<AnimalType, AnimalConfig> = {
  rabbit: {
    type: 'rabbit',
    name: '토끼',
    nickname: '토깽이',
    emoji: '🐰',
    giftSeedType: 'turnip',
    giftSeedCount: 3,
    giftMessage: '새로운 친구 토깽이가\n무 씨앗을 선물로 줬어요!',
    trigger: { type: 'harvest', requiredPlant: 'carrot' },
  },
  turtle: {
    type: 'turtle',
    name: '거북이',
    nickname: '거붕이',
    emoji: '🐢',
    giftSeedType: 'strawberry',
    giftSeedCount: 2,
    giftMessage: '새로운 친구 거붕이가\n딸기 씨앗을 선물로 줬어요!',
    trigger: { type: 'random' },
  },
  hedgehog: {
    type: 'hedgehog',
    name: '고슴도치',
    nickname: '도치',
    emoji: '🦔',
    giftSeedType: 'watermelon',
    giftSeedCount: 2,
    giftMessage: '새로운 친구 도치가\n수박 씨앗을 선물로 줬어요!',
    trigger: { type: 'random' },
  },
  raccoon: {
    type: 'raccoon',
    name: '너구리',
    nickname: '너굴이',
    emoji: '🦝',
    giftSeedType: 'peach',
    giftSeedCount: 1,
    giftMessage: '새로운 친구 너굴이가\n복숭아 씨앗을 선물로 줬어요!',
    trigger: { type: 'random' },
  },
  frog: {
    type: 'frog',
    name: '개구리',
    nickname: '개굴이',
    emoji: '🐸',
    giftSeedType: 'grape',
    giftSeedCount: 1,
    giftMessage: '새로운 친구 개굴이가\n포도 씨앗을 선물로 줬어요!',
    trigger: { type: 'random' },
  },
};
