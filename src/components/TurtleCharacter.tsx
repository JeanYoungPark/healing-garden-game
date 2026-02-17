import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';

const TURTLE_FRAMES = [
  require('../assets/animations/turtle1.png'),
  require('../assets/animations/turtle2.png'),
  require('../assets/animations/turtle3.png'),
  require('../assets/animations/turtle4.png'),
];

const TURTLE_EYES_OPEN = require('../assets/animations/turtle-eyes-open.png');
const TURTLE_EYES_CLOSED = require('../assets/animations/turtle-eyes-closed.png');

// 1-2-3-4-3-2-1 시퀀스 (느린 거북이)
const FRAME_SEQUENCE = [0, 1, 2, 3, 2, 1, 0];
const FRAME_DURATION = 500; // 느린 거북이
const PAUSE_DURATION = 3000;

// 프레임별 눈 위치 (scale 기준 오프셋)
// bottom, left 를 size 비율로 지정
const EYE_POSITIONS: { bottom: number; left: number }[] = [
  { bottom: 0.46, left: 0.21 }, // frame 1
  { bottom: 0.475, left: 0.2 }, // frame 2
  { bottom: 0.5, left: 0.185 }, // frame 3
  { bottom: 0.52, left: 0.17 }, // frame 4
];

// 눈 깜빡임 설정
const BLINK_DURATION = 150;
const MIN_BLINK_INTERVAL = 2500;
const MAX_BLINK_INTERVAL = 5000;

interface TurtleCharacterProps {
  size?: number;
}

export const TurtleCharacter: React.FC<TurtleCharacterProps> = ({ size = 140 }) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [eyesClosed, setEyesClosed] = useState(false);

  // 몸 애니메이션: 1-2-3-4-3-2-1 → 쉬고 → 반복
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

  // 눈 깜빡임
  useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;
    let openTimeout: ReturnType<typeof setTimeout>;

    const blink = () => {
      setEyesClosed(true);
      openTimeout = setTimeout(() => {
        setEyesClosed(false);
        const nextDelay = MIN_BLINK_INTERVAL + Math.random() * (MAX_BLINK_INTERVAL - MIN_BLINK_INTERVAL);
        blinkTimeout = setTimeout(blink, nextDelay);
      }, BLINK_DURATION);
    };

    blinkTimeout = setTimeout(blink, 2000);
    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(openTimeout);
    };
  }, []);

  const currentFrame = FRAME_SEQUENCE[frameIndex];
  const eyePos = EYE_POSITIONS[currentFrame];
  const eyeSize = size * 0.2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 모든 프레임을 미리 렌더링, 현재 프레임만 표시 */}
      {TURTLE_FRAMES.map((source, i) => (
        <Image
          key={i}
          source={source}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: size,
            height: size,
            opacity: i === currentFrame ? 1 : 0,
          }}
          resizeMode="contain"
          fadeDuration={0}
        />
      ))}
      {/* 눈 (프레임별 위치 변경) */}
      <Image
        source={eyesClosed ? TURTLE_EYES_CLOSED : TURTLE_EYES_OPEN}
        style={{
          position: 'absolute',
          bottom: size * eyePos.bottom,
          left: size * eyePos.left,
          width: eyeSize,
          height: eyeSize,
        }}
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
});
