import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, Animated, Easing, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// 화면 너비 기준 비율
const size = screenWidth * 0.3;
const scale = size / 120;

export const RaccoonCharacter: React.FC = () => {
  const [isEyeClosed, setIsEyeClosed] = useState(false);
  const frameIndex = useRef(new Animated.Value(0)).current;

  // 눈 깜빡임: 2.5~5초마다 즉시 전환 (감은 상태 150ms 유지)
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

  // 프레임 애니메이션: 5프레임 순환 (각 프레임 500ms)
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(frameIndex, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(frameIndex, {
          toValue: 2,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(frameIndex, {
          toValue: 3,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(frameIndex, {
          toValue: 4,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(frameIndex, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [frameIndex]);

  // 현재 프레임 결정 (0~4)
  const [currentFrame, setCurrentFrame] = useState(0);
  useEffect(() => {
    const listener = frameIndex.addListener(({ value }) => {
      setCurrentFrame(Math.round(value));
    });
    return () => frameIndex.removeListener(listener);
  }, [frameIndex]);

  // 프레임별 이미지
  const frameImages = [
    require('../assets/animals/raccoon/raccoon1.png'),
    require('../assets/animals/raccoon/raccoon2.png'),
    require('../assets/animals/raccoon/raccoon3.png'),
    require('../assets/animals/raccoon/raccoon4.png'),
    require('../assets/animals/raccoon/raccoon5.png'),
  ];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 몸체 (5프레임) */}
      <Image
        source={frameImages[currentFrame]}
        style={[
          styles.body,
          {
            width: size * 1.3,
            height: size * 1.3,
          },
        ]}
        resizeMode="contain"
      />

      {/* 눈 (즉시 전환) */}
      <Image
        source={
          isEyeClosed
            ? require('../assets/animals/raccoon/raccoon-eyes-closed.png')
            : require('../assets/animals/raccoon/raccoon-eyes-open.png')
        }
        style={[
          styles.eyes,
          {
            width: 45 * scale,
            height: 45 * scale,
            top: 32 * scale,
            left: 26 * scale,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  body: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  eyes: {
    position: 'absolute',
  },
});
