// 🌱 Healing Garden - Back Button Component

import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BackButtonProps {
  onPress: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={[styles.backButton, { bottom: 15 + insets.bottom }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={require('../assets/ui/common/back-btn.png')}
        style={styles.backIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: 15,
    padding: 8,
    zIndex: 10,
  },
  backIcon: {
    width: 60,
    height: 60,
  },
});
