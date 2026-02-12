import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';

const CAT_FRAMES = [
  require('../assets/animations/cat1.png'),
  require('../assets/animations/cat2.png'),
  require('../assets/animations/cat3.png'),
  require('../assets/animations/cat4.png'),
  require('../assets/animations/cat5.png'),
  require('../assets/animations/cat6.png'),
  require('../assets/animations/cat7.png'),
  require('../assets/animations/cat8.png'),
];

const CAT_EYES_OPEN = require('../assets/animations/cat-eyes-open.png');
const CAT_EYES_CLOSED = require('../assets/animations/cat-eyes-closed.png');

// 1-2-3-4-5-6-7-8-7-6-5-4-3-2-1 시퀀스
const FRAME_SEQUENCE = [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0];
const FRAME_DURATION = 125; // 1초에 8프레임
const PAUSE_DURATION = 2000;

// 눈 깜빡임 설정
const BLINK_DURATION = 150; // 깜빡임 지속 시간 (ms)
const MIN_BLINK_INTERVAL = 2000; // 최소 깜빡임 간격 (ms)
const MAX_BLINK_INTERVAL = 4000; // 최대 깜빡임 간격 (ms)

interface CatCharacterProps {
  size?: number; // 컨테이너 높이 기준
}

export const CatCharacter: React.FC<CatCharacterProps> = ({ size = 140 }) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [eyesClosed, setEyesClosed] = useState(false);

  // 애니메이션: 1-2-3-4-5-6-7-8-7-6-5-4-3-2-1 → 쉬고 → 반복
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

  // 눈 깜빡임 애니메이션
  useEffect(() => {
    const scheduleNextBlink = () => {
      const interval = MIN_BLINK_INTERVAL + Math.random() * (MAX_BLINK_INTERVAL - MIN_BLINK_INTERVAL);
      return setTimeout(() => {
        setEyesClosed(true);
        setTimeout(() => {
          setEyesClosed(false);
          timeout = scheduleNextBlink();
        }, BLINK_DURATION);
      }, interval);
    };

    let timeout = scheduleNextBlink();
    return () => clearTimeout(timeout);
  }, []);

  const currentFrame = FRAME_SEQUENCE[frameIndex];

  const eyeSize = size * 0.3; // 눈 크기를 몸통의 60%로

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 몸통 */}
      <Image
        source={CAT_FRAMES[currentFrame]}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: size,
          height: size,
        }}
        resizeMode="contain"
        fadeDuration={0}
      />
      {/* 눈 */}
      <Image
        source={eyesClosed ? CAT_EYES_CLOSED : CAT_EYES_OPEN}
        style={{
          position: 'absolute',
          bottom: size * 0.5,
          left: (size - eyeSize) / 2.7,
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
