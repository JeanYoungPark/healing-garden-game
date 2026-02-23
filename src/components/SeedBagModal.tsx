// 🌱 Healing Garden - Seed Bag Modal

import React from 'react';
import { StyleSheet, View, Image, Modal, ScrollView, ImageBackground, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { calcBackgroundSize, calcElementSize } from '../utils/responsive';
import { modalStyles } from '../styles/modalStyles';
import { useGardenStore } from '../stores/gardenStore';
import { PLANT_CONFIGS } from '../utils/plantConfigs';
import { PlantType } from '../types';

// 배경 크기 계산 (seed-bag: 1000 x 1402)
const { bgWidth, bgHeight } = calcBackgroundSize(1000, 1402);

// 씨앗 박스 크기 계산 (seed-box: 800 x 300)
const { height: seedBoxHeight } = calcElementSize(bgWidth, 0.75, 800, 300);

// 스크롤 영역 마진 (배경 높이 기준)
const scrollMarginTop = bgHeight * 0.25;
const scrollMarginBottom = bgHeight * 0.08;

// 하단 그라데이션 높이 (배경 높이 기준)
const fadeHeight = bgHeight * 0.05;

// 모달 제목 크기 계산 (배경 너비 기준)
const modalTitleFontSize = bgWidth * 0.07;

// 씨앗 이미지 크기
const seedImageSize = seedBoxHeight * 0.7;

interface SeedBagModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSeed: (seedType: PlantType) => void;
}

export const SeedBagModal: React.FC<SeedBagModalProps> = ({ visible, onClose, onSelectSeed }) => {
  const seeds = useGardenStore((state) => state.seeds);

  const handleSeedPress = (seedType: PlantType) => {
    onSelectSeed(seedType);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* 반투명 배경 */}
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        {/* 씨앗 가방 컨텐츠 */}
        <View style={styles.container} pointerEvents="box-none">
          {/* 씨앗 가방 배경 */}
          <ImageBackground
            source={require('../assets/garden/props/seed-bag.png')}
            style={styles.seedBagBackground}
            resizeMode="stretch"
          >
            {/* 모달 제목 */}
            <Text style={styles.modalTitle}>씨앗</Text>

            {/* 씨앗 박스 그리드 */}
            <View style={styles.scrollContainer}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                <View style={styles.grid}>
                  {seeds.map((seedItem) => {
                    const config = PLANT_CONFIGS[seedItem.type];
                    const countText = seedItem.count === -1 ? '무제한' : `x${seedItem.count}`;

                    return (
                      <TouchableOpacity
                        key={seedItem.type}
                        style={styles.seedItem}
                        activeOpacity={0.7}
                        onPress={() => handleSeedPress(seedItem.type)}
                      >
                        <View style={styles.seedBagIconWrapper}>
                          <Image
                            source={require('../assets/seeds/seed-bag.png')}
                            style={styles.seedBagIcon}
                            resizeMode="contain"
                          />
                          <View style={styles.seedBagIconLabelWrapper}>
                            <Text style={styles.seedBagIconLabel} adjustsFontSizeToFit numberOfLines={1}>{config.name}</Text>
                          </View>
                        </View>
                        <Text style={styles.seedName}>{config.name}</Text>
                        <Text style={styles.seedDetail}>{config.growthTime >= 60 ? `${Math.floor(config.growthTime / 60)}시간` : `${config.growthTime}분`}</Text>
                        <Text style={styles.seedCount}>{countText}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              {/* 하단 Fade 그라데이션 */}
              <LinearGradient
                colors={['rgba(247, 230, 196, 0)', 'rgba(247, 230, 196, 0.95)']}
                style={styles.fadeGradient}
                pointerEvents="none"
              />
            </View>

            {/* 닫기 버튼 - 모달 이미지 기준 */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ...modalStyles,
  closeButton: {
    ...modalStyles.closeButton,
    position: 'absolute',
    top: bgHeight * 0.01,
    right: bgWidth * 0.05,
  },
  closeButtonText: modalStyles.closeButtonText,
  seedBagBackground: {
    width: bgWidth,
    height: bgHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    position: 'absolute',
    top: '4%',
    fontSize: modalTitleFontSize,
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
  },
  scrollContainer: {
    flex: 1,
    width: '74%',
    marginTop: scrollMarginTop,
    marginBottom: scrollMarginBottom,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: fadeHeight,
  },
  scrollContent: {
    paddingVertical: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: bgHeight * 0.02,
  },
  seedItem: {
    width: '46%',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f7e6c4',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d4b896',
  },
  seedBagIconWrapper: {
    width: seedImageSize * 0.85,
    height: seedImageSize * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seedBagIcon: {
    width: seedImageSize * 0.85,
    height: seedImageSize * 0.85,
  },
  seedBagIconLabelWrapper: {
    position: 'absolute',
    left: -8,
    right: 0,
    top: 2,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seedBagIconLabel: {
    fontFamily: 'Gaegu-Bold',
    fontSize: 16,
    color: '#7a6854',
    textAlign: 'center',
  },
  seedName: {
    fontSize: bgWidth * 0.055,
    fontFamily: 'Gaegu-Bold',
    color: '#7a6854',
    marginTop: 4,
  },
  seedDetail: {
    fontSize: bgWidth * 0.038,
    fontFamily: 'Gaegu-Regular',
    color: '#A1887F',
    marginTop: 1,
  },
  seedCount: {
    fontSize: bgWidth * 0.04,
    fontFamily: 'Gaegu-Regular',
    color: '#A1887F',
    marginTop: 2,
  },
});
