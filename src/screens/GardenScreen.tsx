// 🌱 Healing Garden - Garden Screen

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Grid } from '../components/Grid';
import { useGardenStore } from '../stores/gardenStore';
import { COLORS } from '../utils/colors';
import { PLANT_CONFIGS } from '../utils/plantConfigs';

export const GardenScreen: React.FC = () => {
  const { plants, gridSize, gold, plantSeed, spendGold } = useGardenStore();

  const handleSlotPress = (slotIndex: number) => {
    // 이미 식물이 심어져 있는지 확인
    const existingPlant = plants.find((p) => p.slotIndex === slotIndex);

    if (existingPlant) {
      // TODO: 물주기 또는 수확 액션
      Alert.alert('🌱', '식물이 자라는 중입니다!');
    } else {
      // 빈 칸 - 씨앗 심기 (임시로 장미만)
      const roseSeed = PLANT_CONFIGS.rose;

      if (spendGold(roseSeed.seedPrice)) {
        plantSeed(slotIndex, 'rose');
        Alert.alert('🌱 심기 완료', `${roseSeed.name}을 심었습니다!`);
      } else {
        Alert.alert('💰 골드 부족', `${roseSeed.seedPrice} 골드가 필요합니다.`);
      }
    }
  };

  return (
    <LinearGradient
      colors={['#E3F2FD', COLORS.background]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🌱 힐링 정원</Text>
          <View style={styles.goldContainer}>
            <Text style={styles.goldText}>💰 {gold}</Text>
          </View>
        </View>

        {/* Garden Grid */}
        <Grid plants={plants} gridSize={gridSize} onSlotPress={handleSlotPress} />

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.infoText}>
            빈 칸을 눌러 장미를 심어보세요 (10 💰)
          </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  goldContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goldText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gold,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
