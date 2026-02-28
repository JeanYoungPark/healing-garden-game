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
    image: require('../assets/garden/props/farm-plot-01.png'),
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
    price: 5000,
  },
  style3: {
    id: 'style3',
    name: '밭 꾸미기 3',
    emoji: '🌿',
    image: require('../assets/garden/props/farm-plot-03.png'),
    shopImage: require('../assets/shop/farm-plot-decor-03.png'),
    description: '밭 꾸미기 3',
    price: 10000,
  },
  style4: {
    id: 'style4',
    name: '밭 꾸미기 4',
    emoji: '🍀',
    image: require('../assets/garden/props/farm-plot-04.png'),
    shopImage: require('../assets/shop/farm-plot-decor-04.png'),
    description: '밭 꾸미기 4',
    price: 15000,
  },
  style5: {
    id: 'style5',
    name: '밭 꾸미기 5',
    emoji: '🌾',
    image: require('../assets/garden/props/farm-plot-05.png'),
    shopImage: require('../assets/shop/farm-plot-decor-05.png'),
    description: '밭 꾸미기 5',
    price: 20000,
  },
  style6: {
    id: 'style6',
    name: '밭 꾸미기 6',
    emoji: '🌻',
    image: require('../assets/garden/props/farm-plot-06.png'),
    shopImage: require('../assets/shop/farm-plot-decor-06.png'),
    description: '밭 꾸미기 6',
    price: 25000,
  },
  style7: {
    id: 'style7',
    name: '밭 꾸미기 7',
    emoji: '🌼',
    image: require('../assets/garden/props/farm-plot-07.png'),
    shopImage: require('../assets/shop/farm-plot-decor-07.png'),
    description: '밭 꾸미기 7',
    price: 30000,
  },
  style8: {
    id: 'style8',
    name: '밭 꾸미기 8',
    emoji: '🌷',
    image: require('../assets/garden/props/farm-plot-08.png'),
    shopImage: require('../assets/shop/farm-plot-decor-08.png'),
    description: '밭 꾸미기 8',
    price: 35000,
  },
};

// 밭 목록 (순서대로 표시)
export const ALL_PLOT_IDS = Object.keys(PLOT_CONFIGS);
