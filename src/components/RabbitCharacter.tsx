import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';

const RABBIT_FRAMES = [
  require('../assets/animations/rabbit1.png'),
  require('../assets/animations/rabbit2.png'),
  require('../assets/animations/rabbit3.png'),
];

// 프레임별 크기 & 위치 (size 기준 비율)
// w: 너비, h: 높이, ml: 수평 오프셋 (+ 오른쪽), mb: 수직 오프셋 (+ 위로)
const FRAME_SIZES = [
  { w: 1.00, h: 1.35, ml: 0, mb: 0 },    // rabbit1
  { w: 1.02, h: 1.20, ml: -0.03, mb: -0.04 },    // rabbit2
  { w: 0.96, h: 1.35, ml: 0, mb: -0.17 },    // rabbit3
];

// 1-2-3-2-1 시퀀스
const FRAME_SEQUENCE = [0, 1, 2, 1, 0];
const FRAME_DURATION = 400;
const PAUSE_DURATION = 2000;

interface RabbitCharacterProps {
  size?: number; // 컨테이너 높이 기준
}

export const RabbitCharacter: React.FC<RabbitCharacterProps> = ({ size = 80 }) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isEyeClosed, setIsEyeClosed] = useState(false);

  // 몸 애니메이션: 1-2-3-2-1 → 쉬고 → 반복
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let currentFrame = 0;

    const playNextFrame = () => {
      currentFrame++;
      if (currentFrame < FRAME_SEQUENCE.length) {
        setFrameIndex(currentFrame);
        timeout = setTimeout(playNextFrame, FRAME_DURATION);
      } else {
        currentFrame = 0;
        setFrameIndex(0);
        timeout = setTimeout(playNextFrame, PAUSE_DURATION);
      }
    };

    timeout = setTimeout(playNextFrame, PAUSE_DURATION);
    return () => clearTimeout(timeout);
  }, []);

  // 눈 깜빡임 (카피바라와 동일 패턴)
  useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;
    let openTimeout: ReturnType<typeof setTimeout>;

    const blink = () => {
      setIsEyeClosed(true);
      openTimeout = setTimeout(() => {
        setIsEyeClosed(false);
        const nextDelay = 2500 + Math.random() * 2500;
        blinkTimeout = setTimeout(blink, nextDelay);
      }, 150);
    };

    blinkTimeout = setTimeout(blink, 2000);
    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(openTimeout);
    };
  }, []);

  const currentFrame = FRAME_SEQUENCE[frameIndex];
  const fs = FRAME_SIZES[currentFrame];
  const frameW = fs.w * size;
  const frameH = fs.h * size;

  // 눈 위치: size 기준 비율 (프레임 1 기준, 하단 정렬이라 상단 오프셋 조정)
  const eyeOffsetBottom = size * 0.73; // 하단에서 58% 위치
  const eyeTop = size - eyeOffsetBottom;
  const scale = size / 80;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 몸체 - 하단 정렬, 수평 중앙 + 프레임별 오프셋 */}
      <Image
        source={RABBIT_FRAMES[currentFrame]}
        style={{
          position: 'absolute',
          bottom: fs.mb * size,
          left: (size - frameW) / 2 + fs.ml * size,
          width: frameW,
          height: frameH,
        }}
        resizeMode="contain"
        fadeDuration={0}
      />

      {/* 눈 */}
      <Image
        source={
          isEyeClosed
            ? require('../assets/animations/rabbit-eye-close.png')
            : require('../assets/animations/rabbit-eye-open.png')
        }
        style={[
          styles.eyes,
          isEyeClosed
            ? {
                width: 34 * scale,
                height: 12 * scale,
                top: eyeTop,
                left: 14 * scale,
              }
            : {
                width: 34 * scale,
                height: 12 * scale,
                top: eyeTop - 1.5 * scale,
                left: 14 * scale,
              },
        ]}
        resizeMode="contain"
        fadeDuration={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  eyes: {
    position: 'absolute',
  },
});
