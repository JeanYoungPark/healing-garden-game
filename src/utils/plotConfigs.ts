// 🌿 Healing Garden - Plot Configurations

import { ImageSourcePropType } from 'react-native';

export interface PlotConfig {
  id: string;
  name: string;
  emoji: string;
  image: ImageSourcePropType;       // 메인 정원에 표시될 밭 이미지
  shopImage?: ImageSourcePropType;  // 상점 아이콘 (없으면 image 사용)
  description: string;
  price: number;                    // 새싹 가격
  isDefault?: boolean;              // 기본 밭 여부 (구매 불필요)
}

export const PLOT_CONFIGS: Record<string, PlotConfig> = {
  basic: {
    id: 'basic',
    name: '기본 밭',
    emoji: '🟫',
    image: require('../assets/garden/props/farm-plot.png'),
    shopImage: require('../assets/shop/farm-plot-decor-01.png'),
    description: '기본 밭',
    price: 0,
    isDefault: true,
  },
  style2: {
    id: 'style2',
    name: '밭 꾸미기 2',
    emoji: '🌱',
    image: require('../assets/garden/props/farm-plot-02.png'),
    shopImage: require('../assets/shop/farm-plot-decor-02.png'),
    description: '밭 꾸미기 2',
    price: 0,
  },
  style3: {
    id: 'style3',
    name: '밭 꾸미기 3',
    emoji: '🌿',
    image: require('../assets/garden/props/farm-plot-03.png'),
    shopImage: require('../assets/shop/farm-plot-decor-03.png'),
    description: '밭 꾸미기 3',
    price: 0,
  },
  style4: {
    id: 'style4',
    name: '밭 꾸미기 4',
    emoji: '🍀',
    image: require('../assets/garden/props/farm-plot-04.png'),
    shopImage: require('../assets/shop/farm-plot-decor-04.png'),
    description: '밭 꾸미기 4',
    price: 0,
  },
  style5: {
    id: 'style5',
    name: '밭 꾸미기 5',
    emoji: '🌾',
    image: require('../assets/garden/props/farm-plot-05.png'),
    shopImage: require('../assets/shop/farm-plot-decor-05.png'),
    description: '밭 꾸미기 5',
    price: 0,
  },
};

// 밭 목록 (순서대로 표시)
export const ALL_PLOT_IDS = Object.keys(PLOT_CONFIGS);
