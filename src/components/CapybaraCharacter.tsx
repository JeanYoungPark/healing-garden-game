import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, Animated, Easing, Dimensions } from 'react-native';
import { useGardenStore } from '../stores/gardenStore';
import { DECORATION_CONFIGS } from '../utils/decorationConfigs';

const { width: screenWidth } = Dimensions.get('window');

// 화면 너비 기준 비율 (기준: 390px 화면에서 120px = 약 0.31)
const size = screenWidth * 0.35;
const scale = size / 120;

export const CapybaraCharacter: React.FC = () => {
  const equippedDecorations = useGardenStore((state) => state.equippedDecorations);
  const [isEyeClosed, setIsEyeClosed] = useState(false);
  const tailRotation = useRef(new Animated.Value(0)).current;

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

  // 꼬리 흔들기: 부드러운 좌우 반복
  useEffect(() => {
    const wag = Animated.loop(
      Animated.sequence([
        Animated.timing(tailRotation, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tailRotation, {
          toValue: -1,
          duration: 600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tailRotation, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    wag.start();
    return () => wag.stop();
  }, [tailRotation]);

  const tailRotateDeg = tailRotation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 꼬리 (몸체 뒤에, 왼쪽 위) */}
      <Animated.Image
        source={require('../assets/animations/capybara-tail.png')}
        style={[
          styles.tail,
          {
            width: 30 * scale,
            height: 20 * scale,
            top: 70 * scale,
            left: 20 * scale,
            transformOrigin: 'right center',
            transform: [
              { rotate: tailRotateDeg },
            ],
          },
        ]}
        resizeMode="contain"
      />

      {/* 몸체 */}
      <Image
        source={require('../assets/animations/capybara-body.png')}
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
            ? require('../assets/animations/capybara-eyes-closed.png')
            : require('../assets/animations/capybara-eyes-open.png')
        }
        style={[
          styles.eyes,
          {
            width: 40 * scale,
            height: 40 * scale,
            top: 32 * scale,
            right: 0 * scale,
          },
        ]}
        resizeMode="contain"
      />

      {/* 장착된 아이템 오버레이 (config 기반) */}
      {equippedDecorations.map((id) => {
        const config = DECORATION_CONFIGS[id];
        if (!config?.mainOverlay) return null;
        const o = config.mainOverlay;
        return (
          <Image
            key={id}
            source={o.image}
            style={{
              position: 'absolute',
              zIndex: 1,
              width: o.width * scale,
              height: o.height * scale,
              top: o.top * scale,
              right: o.right * scale,
            }}
            resizeMode="contain"
          />
        );
      })}
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
  tail: {
    position: 'absolute',
    zIndex: -1,
  },
  eyes: {
    position: 'absolute',
  },
});
