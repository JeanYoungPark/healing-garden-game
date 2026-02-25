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
    name: '기본 울타리',
    emoji: '🪢',
    image: require('../assets/garden/props/fence-01.png'),
    shopImage: require('../assets/shop/fence-decor-01.png'),
    description: '기본 울타리',
    price: 0,
    isDefault: true,
  },
  wood: {
    id: 'wood',
    name: '울타리 꾸미기 2',
    emoji: '🪵',
    image: require('../assets/garden/props/fence-02.png'),
    shopImage: require('../assets/shop/fence-decor-02.png'),
    description: '울타리 꾸미기 2',
    price: 0,
  },
  'wood-flower': {
    id: 'wood-flower',
    name: '울타리 꾸미기 3',
    emoji: '🌸',
    image: require('../assets/garden/props/fence-03.png'),
    shopImage: require('../assets/shop/fence-decor-03.png'),
    description: '울타리 꾸미기 3',
    price: 0,
  },
  fence4: {
    id: 'fence4',
    name: '울타리 꾸미기 4',
    emoji: '🌺',
    image: require('../assets/garden/props/fence-04.png'),
    shopImage: require('../assets/shop/fence-decor-04.png'),
    description: '울타리 꾸미기 4',
    price: 0,
  },
  fence5: {
    id: 'fence5',
    name: '울타리 꾸미기 5',
    emoji: '🌼',
    image: require('../assets/garden/props/fence-05.png'),
    shopImage: require('../assets/shop/fence-decor-05.png'),
    description: '울타리 꾸미기 5',
    price: 0,
  },
  fence6: {
    id: 'fence6',
    name: '울타리 꾸미기 6',
    emoji: '🌻',
    image: require('../assets/garden/props/fence-06.png'),
    shopImage: require('../assets/shop/fence-decor-06.png'),
    description: '울타리 꾸미기 6',
    price: 0,
  },
  fence7: {
    id: 'fence7',
    name: '울타리 꾸미기 7',
    emoji: '🌷',
    image: require('../assets/garden/props/fence-07.png'),
    shopImage: require('../assets/shop/fence-decor-07.png'),
    description: '울타리 꾸미기 7',
    price: 0,
  },
  fence8: {
    id: 'fence8',
    name: '울타리 꾸미기 8',
    emoji: '🏵️',
    image: require('../assets/garden/props/fence-08.png'),
    shopImage: require('../assets/shop/fence-decor-08.png'),
    description: '울타리 꾸미기 8',
    price: 0,
  },
};

// 울타리 목록 (순서대로 표시)
export const ALL_FENCE_IDS = Object.keys(FENCE_CONFIGS);
