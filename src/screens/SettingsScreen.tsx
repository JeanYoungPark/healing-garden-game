// 🍓 Healing Garden - Settings Screen

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../utils/colors';

export const SettingsScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={[COLORS.skyDay, COLORS.background]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.comingSoon}>준비 중입니다 🍓</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});
