import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';

// 물 프레임 이미지 + 크기·위치 (4컷: 1컷은 빈 상태, 2~4컷 물방울 증가)
const WATER_FRAMES: { source: any; w: number; h: number; top: number; right: number }[] = [
  { source: null, w: 0, h: 0, top: 0, right: 0 },
  { source: require('../assets/animations/watering/water-2.png'), w: 0.1, h: 0.3, top: -0.4, right: 0.35 },
  { source: require('../assets/animations/watering/water-3.png'), w: 0.15, h: 0.4, top: -0.33, right: 0.35 },
  { source: require('../assets/animations/watering/water-4.png'), w: 0.3, h: 0.5, top: -0.3, right: 0.3 },
];

interface WateringAnimationProps {
  visible: boolean;
  plotSize: number;
  onComplete: () => void;
}

const FRAME_DURATION = 200;
const TOTAL_FRAMES = 4;
const REPEAT_DURATION = 3000; // 3초 반복

export const WateringAnimation: React.FC<WateringAnimationProps> = ({ visible, plotSize, onComplete }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!visible) {
      setFrameIndex(0);
      return;
    }

    // 페이드인
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();

    // 4컷 프레임 반복 재생
    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % TOTAL_FRAMES;
      setFrameIndex(frame);
    }, FRAME_DURATION);

    // 3초 후 페이드아웃
    const timeout = setTimeout(() => {
      clearInterval(interval);
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true })
        .start(() => {
          setFrameIndex(0);
          onComplete();
        });
    }, REPEAT_DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="none">
      {/* 물뿌리개 (고정) - 밭 오른쪽 위에서 뿌리는 모습 */}
      <Image
        source={require('../assets/animations/watering/watering-can.png')}
        style={{
          position: 'absolute',
          width: plotSize * 0.45,
          height: plotSize * 0.45,
          top: plotSize * -0.6,
          right: plotSize * -0.05,
        }}
        resizeMode="contain"
      />

      {/* 물 애니메이션 (4컷 반복) */}
      {WATER_FRAMES[frameIndex].source && (
        <Image
          source={WATER_FRAMES[frameIndex].source}
          style={{
            position: 'absolute',
            width: plotSize * WATER_FRAMES[frameIndex].w,
            height: plotSize * WATER_FRAMES[frameIndex].h,
            top: plotSize * WATER_FRAMES[frameIndex].top,
            right: plotSize * WATER_FRAMES[frameIndex].right,
          }}
          resizeMode="contain"
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
  },
});
