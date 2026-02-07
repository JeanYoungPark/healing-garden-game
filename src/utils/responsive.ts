// 🌱 Healing Garden - Responsive Layout Utilities

import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * 배경 이미지 비율에 맞게 최적 크기 계산
 * @param imageWidth 이미지 원본 너비
 * @param imageHeight 이미지 원본 높이
 * @param maxHeightRatio 화면 높이 대비 최대 비율 (기본 0.8)
 * @param horizontalPadding 좌우 패딩 (기본 30)
 */
export function calcBackgroundSize(
  imageWidth: number,
  imageHeight: number,
  maxHeightRatio: number = 0.8,
  horizontalPadding: number = 30
) {
  const aspectRatio = imageWidth / imageHeight;
  const maxHeight = screenHeight * maxHeightRatio;
  const availableWidth = screenWidth - horizontalPadding;

  const heightFromWidth = availableWidth / aspectRatio;

  // 높이가 최대값을 초과하면 높이 기준으로, 아니면 너비 기준으로
  const bgWidth = heightFromWidth > maxHeight
    ? maxHeight * aspectRatio
    : availableWidth;
  const bgHeight = heightFromWidth > maxHeight
    ? maxHeight
    : heightFromWidth;

  return { bgWidth, bgHeight };
}

/**
 * 배경 대비 비율로 요소 크기 계산
 * @param bgWidth 배경 너비
 * @param bgHeight 배경 높이
 * @param widthRatio 배경 너비 대비 비율
 * @param imageWidth 요소 이미지 원본 너비
 * @param imageHeight 요소 이미지 원본 높이
 */
export function calcElementSize(
  bgWidth: number,
  widthRatio: number,
  imageWidth: number,
  imageHeight: number
) {
  const elementWidth = bgWidth * widthRatio;
  const elementHeight = elementWidth * (imageHeight / imageWidth);

  return { width: elementWidth, height: elementHeight };
}

/**
 * 배경 높이 대비 비율로 위치 계산
 * @param bgHeight 배경 높이
 * @param ratio 배경 높이 대비 비율
 */
export function calcPosition(bgHeight: number, ratio: number) {
  return bgHeight * ratio;
}

// 화면 크기 상수 export
export { screenWidth, screenHeight };
