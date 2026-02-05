// 🌱 Healing Garden - Seed Bag Modal

import React from 'react';
import { StyleSheet, View, Image, Modal, ScrollView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

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
        <View style={styles.container}>
          {/* 씨앗 가방 배경 */}
          <ImageBackground
            source={require('../assets/garden/props/seed-bag.png')}
            style={styles.seedBagBackground}
            resizeMode="contain"
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
                    <View key={index} style={styles.seedBoxWrapper}>
                      <Image
                        source={require('../assets/garden/props/seed-box.png')}
                        style={styles.seedBox}
                        resizeMode="contain"
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* 하단 Fade 그라데이션 */}
              <LinearGradient
                colors={['transparent', 'rgba(247, 230, 196, 0.95)']}
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
    width: width - 30,
    height: height * 0.75,
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
    width: '80%',
    marginTop: 190,
    marginBottom: 130,
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
    height: 60,
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
    marginBottom: 5,
  },
  seedBox: {
    width: '100%',
    height: 90,
  },
});
