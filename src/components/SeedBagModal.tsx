// 🌱 Healing Garden - Seed Bag Modal

import React from 'react';
import { StyleSheet, View, Image, Modal, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { calcBackgroundSize, calcElementSize } from '../utils/responsive';

// 배경 크기 계산 (seed-bag: 1000 x 1402)
const { bgWidth, bgHeight } = calcBackgroundSize(1000, 1402);

// 씨앗 박스 크기 계산 (seed-box: 800 x 300)
const { width: seedBoxWidth, height: seedBoxHeight } = calcElementSize(bgWidth, 0.75, 800, 300);

// 스크롤 영역 마진 (배경 높이 기준)
const scrollMarginTop = bgHeight * 0.25;
const scrollMarginBottom = bgHeight * 0.08;

// 하단 그라데이션 높이 (배경 높이 기준)
const fadeHeight = bgHeight * 0.05;

// 씨앗 박스 간격 (배경 높이 기준)
const seedBoxMargin = bgHeight * 0.01;

interface SeedBagModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SeedBagModal: React.FC<SeedBagModalProps> = ({ visible, onClose }) => {
  // 임시로 6개의 seed-box 생성
  const seedSlots = Array.from({ length: 6 }, (_, i) => i);

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
            {/* 씨앗 박스 그리드 */}
            <View style={styles.scrollContainer}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                <View style={styles.grid}>
                  {seedSlots.map((index) => (
                    <View key={index} style={[styles.seedBoxWrapper, { marginBottom: seedBoxMargin }]}>
                      <Image
                        source={require('../assets/garden/props/seed-box.png')}
                        style={[styles.seedBox, { width: seedBoxWidth, height: seedBoxHeight }]}
                        resizeMode="contain"
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* 하단 Fade 그라데이션 */}
              <LinearGradient
                colors={['rgba(247, 230, 196, 0)', 'rgba(247, 230, 196, 0.95)']}
                style={styles.fadeGradient}
                pointerEvents="none"
              />
            </View>
          </ImageBackground>
        </View>

        {/* 닫기 버튼 - 화면 기준 절대 위치 */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/ui/common/back-btn.png')}
            style={styles.closeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  seedBagBackground: {
    width: bgWidth,
    height: bgHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    bottom: 7,
    right: 7,
    zIndex: 100,
    padding: 8,
  },
  closeIcon: {
    width: 50,
    height: 50,
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
    paddingVertical: 0
  },
  grid: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  seedBoxWrapper: {
    width: '100%',
  },
  seedBox: {},
});
