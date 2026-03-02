// 🌱 Healing Garden - Resource Bar Component (Kawaii Cozy Style)

import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { calcBackgroundSize } from '../utils/responsive';

interface ResourceBarProps {
  gold: number;
  water: number;
  onQuestPress?: () => void;
  onCollectionPress?: () => void;
  onSettingsPress?: () => void;
  hasNewCollection?: boolean;
  canClaimQuestReward?: boolean;
}

// 숫자를 K, M 단위로 축약
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

export const ResourceBar: React.FC<ResourceBarProps> = ({
  gold,
  water,
  onQuestPress,
  onCollectionPress,
  onSettingsPress,
  hasNewCollection,
  canClaimQuestReward,
}) => {
  const { bgWidth, bgHeight } = calcBackgroundSize(1081, 153);

  // 배경 너비 기준 비례 크기 계산
  const resourceIconSize = bgWidth * 0.04; // 리소스 아이콘 크기 (새싹, 물방울)
  const topIconSize = bgWidth * 0.085; // 상단 아이콘 크기 (퀘스트, 도감, 설정)
  const addIconSize = bgWidth * 0.06; // 더하기 아이콘
  const fontSize = bgWidth * 0.05; // 텍스트 크기
  const separatorWidth = bgWidth * 0.004; // 구분선 너비
  const separatorHeight = bgWidth * 0.07; // 구분선 높이
  const redDotSize = bgWidth * 0.02; // 빨간 점 크기

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/ui/common/resource-bar-bg.png')}
        style={[styles.background, { width: bgWidth, height: bgHeight }]}
        resizeMode="contain"
      >
        <View style={styles.content}>
          {/* 왼쪽: 리소스 */}
          <View style={styles.leftSection}>
            {/* 새싹 */}
            <View style={styles.statItem}>
              <Image
                source={require('../assets/ui/common/leaf-coin.png')}
                style={{ width: resourceIconSize, height: resourceIconSize }}
                resizeMode="contain"
              />
              <Text style={[styles.valueText, { fontSize }]}>{formatNumber(gold)}</Text>
              <Image
                source={require('../assets/ui/common/add-icon.png')}
                style={{ width: addIconSize, height: addIconSize }}
                resizeMode="contain"
              />
            </View>

            {/* 물방울 */}
            <View style={styles.statItem}>
              <Image
                source={require('../assets/ui/common/water-drop.png')}
                style={{ width: resourceIconSize * 0.85, height: resourceIconSize * 0.85 }}
                resizeMode="contain"
              />
              <Text style={[styles.valueText, { fontSize }]}>{water}/5</Text>
              <Image
                source={require('../assets/ui/common/add-icon.png')}
                style={{ width: addIconSize, height: addIconSize }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* 구분선 */}
          <Image
            source={require('../assets/ui/common/separator.png')}
            style={{ width: separatorWidth, height: separatorHeight }}
            resizeMode="contain"
          />

          {/* 오른쪽: 아이콘 */}
          <View style={styles.rightSection}>
            <TouchableOpacity onPress={onQuestPress} activeOpacity={0.7} style={styles.iconButton}>
              <Image
                source={require('../assets/garden/icons/quest-icon.png')}
                style={{ width: topIconSize, height: topIconSize }}
                resizeMode="contain"
              />
              {canClaimQuestReward && (
                <View style={[styles.redDot, {
                  width: redDotSize,
                  height: redDotSize,
                  borderRadius: redDotSize / 2
                }]} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onCollectionPress} activeOpacity={0.7} style={styles.iconButton}>
              <Image
                source={require('../assets/garden/icons/collection-icon.png')}
                style={{ width: topIconSize, height: topIconSize }}
                resizeMode="contain"
              />
              {hasNewCollection && (
                <View style={[styles.redDot, {
                  width: redDotSize,
                  height: redDotSize,
                  borderRadius: redDotSize / 2
                }]} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onSettingsPress} activeOpacity={0.7}>
              <Image
                source={require('../assets/garden/icons/settings-icon.png')}
                style={{ width: topIconSize, height: topIconSize }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 6,
    paddingVertical: 16,
    alignItems: 'center',
    overflow: 'visible',
  },
  background: {
    overflow: 'visible',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: '#E08080',
    borderWidth: 1.5,
    borderColor: '#7a6854',
  },
  valueText: {
    color: '#A1887F',
    fontFamily: 'Gaegu-Bold',
  },
});
