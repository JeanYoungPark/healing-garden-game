import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, Animated, Easing } from 'react-native';

interface OwlCharacterProps {
  size?: number;
}

export const OwlCharacter: React.FC<OwlCharacterProps> = ({ size = 120 }) => {
  const [isEyeClosed, setIsEyeClosed] = useState(false);
  const headMovement = useRef(new Animated.Value(0)).current;

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

  // 머리 위아래 움직임: 부드러운 상하 반복 (올빼미처럼)
  useEffect(() => {
    const nod = Animated.loop(
      Animated.sequence([
        Animated.timing(headMovement, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(headMovement, {
          toValue: -1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(headMovement, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    nod.start();
    return () => nod.stop();
  }, [headMovement]);

  const headTranslateY = headMovement.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [3, 0, -3], // 위아래로 3px씩 움직임
  });

  const scale = size / 120;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 몸체 (고정) */}
      <Image
        source={require('../assets/animations/owl-body.png')}
        style={[
          styles.body,
          {
            width: size,
            height: size,
          },
        ]}
        resizeMode="contain"
      />

      {/* 머리 (위아래 움직임) */}
      <Animated.View
        style={[
          styles.headContainer,
          {
            transform: [{ translateY: headTranslateY }],
          },
        ]}
      >
        <Image
          source={require('../assets/animations/owl-head.png')}
          style={[
            styles.head,
            {
              width: size,
              height: size,
            },
          ]}
          resizeMode="contain"
        />

        {/* 눈 (머리 위에 overlay, 즉시 전환) */}
        <Image
          source={
            isEyeClosed
              ? require('../assets/animations/owl-eyes-closed.png')
              : require('../assets/animations/owl-eyes-open.png')
          }
          style={[
            styles.eyes,
            isEyeClosed
              ? {
                  width: 50 * scale,
                  height: 50 * scale,
                  top: 20 * scale,
                  left: 20 * scale,
                }
              : {
                  width: 50 * scale,
                  height: 50 * scale,
                  top: 18 * scale,
                  left: 20 * scale,
                },
          ]}
          resizeMode="contain"
        />
      </Animated.View>
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
  headContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  head: {
    position: 'absolute',
  },
  eyes: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
