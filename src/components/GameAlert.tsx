import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';

interface GameAlertProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export const GameAlert: React.FC<GameAlertProps> = ({ visible, message, onClose, duration = 800 }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      opacity.setValue(0);
      scale.setValue(0.8);

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start(() => {
        setTimeout(() => {
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true })
            .start(() => onClose());
        }, duration);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.bubble,
        { opacity, transform: [{ scale }] },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    backgroundColor: '#FFF8EE',
    borderWidth: 2.5,
    borderColor: '#D4B896',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
    zIndex: 999,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Gaegu-Bold',
    color: '#7a6854',
    textAlign: 'center',
  },
});
