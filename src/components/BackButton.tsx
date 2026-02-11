// 🌱 Healing Garden - Back Button Component

import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
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
      <Text style={styles.backText}>X</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: 15,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5EDD6',
    borderWidth: 2,
    borderColor: '#8B6F47',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  backText: {
    fontSize: 26,
    fontFamily: 'Gaegu-Bold',
    color: '#5D4037',
    marginTop: -2,
  },
});
