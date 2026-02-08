// 🌱 Healing Garden - Settings Modal

import React from 'react';
import { StyleSheet, View, Image, Modal, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { modalStyles } from '../styles/modalStyles';
import { calcBackgroundSize, calcElementSize } from '../utils/responsive';
import { useGardenStore } from '../stores/gardenStore';

// 배경 크기 계산 (settings-bg: 1099 x 1047)
const { bgWidth, bgHeight } = calcBackgroundSize(1099, 1047);

// 아이템 크기 계산 (settings-item: 784 x 127) - 배경 너비의 85%
const { width: itemWidth, height: itemHeight } = calcElementSize(bgWidth, 0.8, 784, 127);

// 텍스트 크기 (아이템 높이 기준)
const itemFontSize = itemHeight * 0.5;

// 모달 제목 크기 계산 (배경 너비 기준)
const modalTitleFontSize = bgWidth * 0.07;

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { soundEnabled, notificationEnabled, toggleSound, toggleNotification } = useGardenStore();

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
        {/* 설정 컨텐츠 */}
        <View style={styles.container}>
          {/* 설정 배경 */}
          <ImageBackground
            source={require('../assets/garden/props/settings-bg.png')}
            style={styles.settingsBackground}
            resizeMode="contain"
          >
            {/* 모달 제목 */}
            <Text style={styles.modalTitle}>설정</Text>

            {/* 설정 아이템들 */}
            <View style={styles.itemsContainer}>
              {/* 아이템 1 - 소리 토글 */}
              <View style={styles.itemRow}>
                <Image
                  source={require('../assets/ui/common/settings-item1.png')}
                  style={styles.settingsItem}
                  resizeMode="contain"
                />
                <Text style={styles.itemLabel}>소리/진동</Text>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={toggleSound}
                  activeOpacity={0.8}
                >
                  <View style={styles.toggleContainer}>
                    <Image
                      source={
                        soundEnabled
                          ? require('../assets/ui/common/toggle-bg-on.png')
                          : require('../assets/ui/common/toggle-bg-off.png')
                      }
                      style={styles.toggleBg}
                      resizeMode="contain"
                      fadeDuration={0}
                    />
                    <Image
                      source={
                        soundEnabled
                          ? require('../assets/ui/common/toggle-on.png')
                          : require('../assets/ui/common/toggle-off.png')
                      }
                      style={[
                        styles.toggleImage,
                        { left: soundEnabled ? itemWidth * 0.14 : 0 }
                      ]}
                      resizeMode="contain"
                      fadeDuration={0}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* 아이템 2 - 알림 토글 */}
              <View style={styles.itemRow}>
                <Image
                  source={require('../assets/ui/common/settings-item2.png')}
                  style={styles.settingsItem}
                  resizeMode="contain"
                />
                <Text style={styles.itemLabel}>알림</Text>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={toggleNotification}
                  activeOpacity={0.8}
                >
                  <View style={styles.toggleContainer}>
                    <Image
                      source={
                        notificationEnabled
                          ? require('../assets/ui/common/toggle-bg-on.png')
                          : require('../assets/ui/common/toggle-bg-off.png')
                      }
                      style={styles.toggleBg}
                      resizeMode="contain"
                      fadeDuration={0}
                    />
                    <Image
                      source={
                        notificationEnabled
                          ? require('../assets/ui/common/toggle-on.png')
                          : require('../assets/ui/common/toggle-off.png')
                      }
                      style={[
                        styles.toggleImage,
                        { left: notificationEnabled ? itemWidth * 0.14 : 0 }
                      ]}
                      resizeMode="contain"
                      fadeDuration={0}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* 아이템 3 - 고객센터 */}
              <TouchableOpacity style={styles.itemRow} activeOpacity={0.8}>
                <Image
                  source={require('../assets/ui/common/settings-item3.png')}
                  style={styles.settingsItem}
                  resizeMode="contain"
                />
                <Text style={styles.itemLabel}>고객센터</Text>
              </TouchableOpacity>

              {/* 아이템 4 - 게임종료 */}
              <TouchableOpacity style={styles.itemRow} activeOpacity={0.8}>
                <Image
                  source={require('../assets/ui/common/settings-item4.png')}
                  style={styles.settingsItem}
                  resizeMode="contain"
                />
                <Text style={styles.itemLabel}>게임종료</Text>
              </TouchableOpacity>

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
  ...modalStyles,
  settingsBackground: {
    width: bgWidth,
    height: bgHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    position: 'absolute',
    top: '8%',
    fontSize: modalTitleFontSize,
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
  },
  itemsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: bgHeight * 0.03,
    marginTop: bgHeight * 0.08,
  },
  itemRow: {
    width: itemWidth,
    height: itemHeight,
    position: 'relative',
    justifyContent: 'center',
  },
  settingsItem: {
    width: itemWidth,
    height: itemHeight,
    position: 'absolute',
    left: -itemWidth * 0.02,
  },
  itemLabel: {
    position: 'absolute',
    left: itemWidth * 0.17,
    fontSize: itemFontSize,
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
  },
  toggleButton: {
    position: 'absolute',
    right: itemWidth * 0.04,
    padding: 5,
  },
  toggleContainer: {
    position: 'relative',
    width: itemWidth * 0.24,
    height: itemWidth * 0.18,
  },
  toggleBg: {
    position: 'absolute',
    width: itemWidth * 0.24,
    height: itemWidth * 0.18,
  },
  toggleImage: {
    position: 'absolute',
    width: itemWidth * 0.1,
    height: itemWidth * 0.1,
    top: itemWidth * 0.039,
  },
});
