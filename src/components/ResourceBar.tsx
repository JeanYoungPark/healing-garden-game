// 🌱 Healing Garden - Resource Bar Component (Kawaii Cozy Style)

import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';
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
      {/* 레벨 박스 */}
      <ImageBackground
        source={require('../assets/ui/common/header-box.png')}
        style={styles.statBox}
        resizeMode="stretch"
      >
        {/* 카피바라 아이콘 */}
        <View style={styles.capybaraContainer}>
          <Image
            source={require('../assets/ui/common/capybara-level.png')}
            style={styles.capybaraImage}
            resizeMode="contain"
          />
        </View>
        <View style={[styles.statContent, styles.levelContent]}>
          <Text style={styles.label}>LV</Text>
          <Text style={styles.valueText}>{level}</Text>
        </View>
      </ImageBackground>

      {/* 코인 박스 */}
      <ImageBackground
        source={require('../assets/ui/common/header-box.png')}
        style={styles.statBox}
        resizeMode="stretch"
      >
        <View style={styles.statContentRight}>
          <Text style={styles.valueText}>{gold}</Text>
          <Image
            source={require('../assets/ui/common/leaf-coin.png')}
            style={styles.coinIcon}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>

      {/* 물뿌리개 박스 */}
      <ImageBackground
        source={require('../assets/ui/common/header-box.png')}
        style={styles.statBox}
        resizeMode="stretch"
      >
        <View style={styles.statContentRight}>
          <Text style={styles.valueText}>{tickets}/3</Text>
          <Image
            source={require('../assets/ui/common/water-drop.png')}
            style={styles.waterIcon}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    paddingVertical: 16,
    gap: 8,
    overflow: 'visible',
  },
  statBox: {
    flex: 1,
    height: 30,
    position: 'relative',
    overflow: 'visible',
  },
  capybaraContainer: {
    position: 'absolute',
    left: 7,
    top: -5,
    zIndex: 2,
    width: 35,
    height: 35,
  },
  capybaraImage: {
    width: '100%',
    height: '100%',
  },
  statContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 1,
    paddingTop: 2,
    paddingBottom: 6,
  },
  statContentRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    zIndex: 1,
    paddingTop: 2,
    paddingBottom: 6,
    paddingRight: 18,
  },
  levelContent: {
    paddingLeft: 28,
  },
  label: {
    fontSize: 13,
    color: '#A1887F',
    fontFamily: 'Gaegu-Bold',
  },
  valueText: {
    fontSize: 15,
    color: '#A1887F',
    fontFamily: 'Gaegu-Bold',
  },
  icon: {
    fontSize: 16,
    fontFamily: 'Gaegu-Regular',
  },
  coinIcon: {
    width: 10,
    height: 10,
  },
  waterIcon: {
    width: 10,
    height: 10,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 75,
    justifyContent: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
});
