// 🌿 Healing Garden - Fence Configurations

import { ImageSourcePropType } from 'react-native';

export interface FenceConfig {
  id: string;
  name: string;
  emoji: string;
  image: ImageSourcePropType;       // 메인 정원에 표시될 울타리 이미지
  shopImage?: ImageSourcePropType;  // 상점 아이콘 (없으면 image 사용)
  description: string;
  price: number;                    // 새싹 가격
  isDefault?: boolean;              // 기본 울타리 여부 (구매 불필요)
}

export const FENCE_CONFIGS: Record<string, FenceConfig> = {
  rope: {
    id: 'rope',
    name: '줄 울타리',
    emoji: '🪢',
    image: require('../assets/garden/props/fence-rope.png'),
    shopImage: require('../assets/shop/fence-decor-01.png'),
    description: '기본 울타리',
    price: 0,
    isDefault: true,
  },
  wood: {
    id: 'wood',
    name: '나무 울타리',
    emoji: '🪵',
    image: require('../assets/garden/props/fence-wood.png'),
    shopImage: require('../assets/shop/fence-decor-02.png'),
    description: '튼튼한 나무 울타리',
    price: 5000,
  },
  'wood-flower': {
    id: 'wood-flower',
    name: '꽃 나무 울타리',
    emoji: '🌸',
    image: require('../assets/garden/props/fence-wood-flower.png'),
    shopImage: require('../assets/shop/fence-decor-03.png'),
    description: '꽃이 핀 아름다운 나무 울타리',
    price: 10000,
  },
};

// 울타리 목록 (순서대로 표시)
export const ALL_FENCE_IDS = Object.keys(FENCE_CONFIGS);
