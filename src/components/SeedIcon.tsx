// 🌱 Healing Garden - Seed Icon Component

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SeedIconProps {
  size?: number;
}

export const SeedIcon: React.FC<SeedIconProps> = ({ size = 40 }) => {
  return (
    <View style={[styles.container, { width: size, height: size * 0.89 }]}>
      <View style={[styles.seed, { width: size * 0.3, height: size * 0.4 }]} />
      <View style={[styles.seed, { width: size * 0.28, height: size * 0.35, top: size * 0.1 }]} />
      <View style={[styles.seed, { width: size * 0.32, height: size * 0.45, top: size * 0.45 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seed: {
    position: 'absolute',
    backgroundColor: '#B98A5A',
    borderRadius: 100,
  },
});
