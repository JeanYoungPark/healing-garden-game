// 🍓 Healing Garden - Image Resources Manager
// 과일 이미지 리소스 관리 (현재는 이모지 사용 중)

/**
 * 이미지를 추가하는 방법:
 * 1. 해당 폴더에 이미지 파일 추가
 * 2. 아래 객체에 require() 추가
 * 3. TypeScript 타입이 자동으로 인식됨
 */

// 현재 미사용 - 추후 실제 이미지 적용 시 사용
/*
export const FruitImages = {
  // 딸기 (Strawberry)
  strawberry_seed: require('./plants/strawberry_seed.png'),
  strawberry_sprout: require('./plants/strawberry_sprout.png'),
  strawberry_flower: require('./plants/strawberry_flower.png'),
  strawberry_fruit: require('./plants/strawberry_fruit.png'),

  // 수박 (Watermelon)
  watermelon_seed: require('./plants/watermelon_seed.png'),
  watermelon_sprout: require('./plants/watermelon_sprout.png'),
  watermelon_flower: require('./plants/watermelon_flower.png'),
  watermelon_fruit: require('./plants/watermelon_fruit.png'),

  // 복숭아 (Peach)
  peach_seed: require('./plants/peach_seed.png'),
  peach_sprout: require('./plants/peach_sprout.png'),
  peach_flower: require('./plants/peach_flower.png'),
  peach_fruit: require('./plants/peach_fruit.png'),

  // 포도 (Grape)
  grape_seed: require('./plants/grape_seed.png'),
  grape_sprout: require('./plants/grape_sprout.png'),
  grape_flower: require('./plants/grape_flower.png'),
  grape_fruit: require('./plants/grape_fruit.png'),

  // 사과 (Apple)
  apple_seed: require('./plants/apple_seed.png'),
  apple_sprout: require('./plants/apple_sprout.png'),
  apple_flower: require('./plants/apple_flower.png'),
  apple_fruit: require('./plants/apple_fruit.png'),
};

export const UIImages = {
  // 아이콘
  icon_water: require('./ui/icon_water.png'),
  icon_gold: require('./ui/icon_gold.png'),
  icon_shop: require('./ui/icon_shop.png'),
  icon_book: require('./ui/icon_book.png'),
  icon_settings: require('./ui/icon_settings.png'),

  // 버튼
  button_normal: require('./ui/button_normal.png'),
  button_pressed: require('./ui/button_pressed.png'),
  button_disabled: require('./ui/button_disabled.png'),

  // 패널/프레임
  panel_bg: require('./ui/panel_bg.png'),

  // 효과
  sparkle: require('./ui/sparkle.png'),
  water_drop: require('./ui/water_drop.png'),
};

export const BackgroundImages = {
  // 배경 (현재는 LinearGradient 사용 중)
  sky_day: require('./backgrounds/sky_day.png'),
  sky_night: require('./backgrounds/sky_night.png'),
  ground_grass: require('./backgrounds/ground_grass.png'),
  ground_soil: require('./backgrounds/ground_soil.png'),

  // 장식
  cloud_1: require('./backgrounds/cloud_1.png'),
  cloud_2: require('./backgrounds/cloud_2.png'),
};

export const DecorationImages = {
  // 인테리어 (추후 추가)
  fence: require('./decorations/fence.png'),
  bench: require('./decorations/bench.png'),
  fountain: require('./decorations/fountain.png'),
};

// 편의 함수: 과일 타입과 단계로 이미지 가져오기
export const getFruitImage = (
  fruitType: 'strawberry' | 'watermelon' | 'peach' | 'grape' | 'apple',
  stage: 0 | 1 | 2 | 3
) => {
  const stageNames = ['seed', 'sprout', 'flower', 'fruit'] as const;
  const key = `${fruitType}_${stageNames[stage]}` as keyof typeof FruitImages;
  return FruitImages[key];
};
*/

// 현재는 이모지 사용 중이므로 export 없음
export {};
