// 🌱 Healing Garden - Resource Bar Component (Kawaii Cozy Style)

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../utils/colors';

interface ResourceItemProps {
  icon: string;
  value: number;
  backgroundColor?: string;
  maxValue?: number; // 최대값이 있으면 "3/3" 형태로 표시
}

const ResourceItem: React.FC<ResourceItemProps> = ({
  icon,
  value,
  backgroundColor = COLORS.primary,
  maxValue,
}) => {
  return (
    <View style={[styles.resourceItem, { backgroundColor }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>
        {maxValue ? `${value}/${maxValue}` : value}
      </Text>
    </View>
  );
};

interface ResourceBarProps {
  level: number;
  gold: number;
  tickets: number;
}

export const ResourceBar: React.FC<ResourceBarProps> = ({
  level,
  gold,
  tickets,
}) => {
  return (
    <View style={styles.container}>
      {/* 레벨 */}
      <ResourceItem
        icon="⭐"
        value={level}
        backgroundColor={COLORS.lavender}
      />

      {/* 코인 */}
      <ResourceItem
        icon="✨"
        value={gold}
        backgroundColor={COLORS.primary}
      />

      {/* 티켓 */}
      <ResourceItem
        icon="🎫"
        value={tickets}
        backgroundColor={COLORS.peach}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    // 부드러운 그림자
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 75,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
});
