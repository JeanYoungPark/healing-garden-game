import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';

const RABBIT_FRAMES = [
  require('../assets/animations/rabbit1.png'),
  require('../assets/animations/rabbit2.png'),
  require('../assets/animations/rabbit3.png'),
  require('../assets/animations/rabbit4.png'),
  require('../assets/animations/rabbit5.png'),
];

// 원본 픽셀 크기: 212x301 (모두 동일)
const ASPECT = 212 / 301; // w/h 비율

// 1-2-3-4-5-4-3-2-1 시퀀스
const FRAME_SEQUENCE = [0, 1, 2, 3, 4, 3, 2, 1, 0];
const FRAME_DURATION = 400;
const PAUSE_DURATION = 2000;

interface RabbitCharacterProps {
  size?: number; // 컨테이너 높이 기준
}

export const RabbitCharacter: React.FC<RabbitCharacterProps> = ({ size = 120 }) => {
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
  const frameH = size;
  const frameW = frameH * ASPECT;

  const eyeOffsetBottom = size * 0.61;
  const eyeTop = size - eyeOffsetBottom;
  const scale = size / 80;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 몸체 - 하단 정렬, 수평 중앙 */}
      <Image
        source={RABBIT_FRAMES[currentFrame]}
        style={{
          position: 'absolute',
          bottom: 0,
          left: (size - frameW) / 2,
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
          {
            width: 22 * scale,
            height: 6 * scale,
            top: eyeTop,
            left: 24.5 * scale,
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
