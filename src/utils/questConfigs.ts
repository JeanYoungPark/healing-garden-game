// 🌱 Healing Garden - Daily Quest Configurations

import { QuestId } from '../types';

export interface QuestConfig {
  id: QuestId;
  name: string;
  target: number;
  icon: any; // require() 이미지
  unit: string;
}

export const QUEST_CONFIGS: QuestConfig[] = [
  {
    id: 'plant',
    name: '씨앗 심기',
    target: 3,
    icon: require('../assets/quest/quest-01.png'),
    unit: '회',
  },
  {
    id: 'water',
    name: '물 주기',
    target: 5,
    icon: require('../assets/quest/quest-02.png'),
    unit: '회',
  },
  {
    id: 'harvest',
    name: '수확하기',
    target: 2,
    icon: require('../assets/quest/quest-03.png'),
    unit: '회',
  },
  {
    id: 'activeTime',
    name: '활동 시간',
    target: 10,
    icon: require('../assets/quest/quest-04.png'),
    unit: '분',
  },
  {
    id: 'claimAnimal',
    name: '동물 만나기',
    target: 1,
    icon: require('../assets/quest/quest-05.png'),
    unit: '회',
  },
];

export const QUEST_REWARD_GOLD = 500;
