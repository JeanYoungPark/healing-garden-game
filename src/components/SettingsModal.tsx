// 🌱 Healing Garden - Settings Modal

import React from 'react';
import { StyleSheet, View, Image, Modal, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [notificationEnabled, setNotificationEnabled] = React.useState(true);

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
            {/* 설정 아이템들 */}
            <View style={styles.itemsContainer}>
              {/* 아이템 1 - 토글 */}
              <View style={styles.itemRow}>
                <Image
                  source={require('../assets/ui/common/settings-item1.png')}
                  style={styles.settingsItem}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setSoundEnabled(!soundEnabled)}
                  activeOpacity={0.8}
                >
                  <View style={styles.toggleContainer}>
                    {/* 배경 */}
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
                    {/* 토글 */}
                    <Image
                      source={
                        soundEnabled
                          ? require('../assets/ui/common/toggle-on.png')
                          : require('../assets/ui/common/toggle-off.png')
                      }
                      style={[
                        styles.toggleImage,
                        { left: soundEnabled ? 36 : 0 }
                      ]}
                      resizeMode="contain"
                      fadeDuration={0}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* 아이템 2 - 토글 */}
              <View style={styles.itemRow}>
                <Image
                  source={require('../assets/ui/common/settings-item2.png')}
                  style={styles.settingsItem}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setNotificationEnabled(!notificationEnabled)}
                  activeOpacity={0.8}
                >
                  <View style={styles.toggleContainer}>
                    {/* 배경 */}
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
                    {/* 토글 */}
                    <Image
                      source={
                        notificationEnabled
                          ? require('../assets/ui/common/toggle-on.png')
                          : require('../assets/ui/common/toggle-off.png')
                      }
                      style={[
                        styles.toggleImage,
                        { left: notificationEnabled ? 36 : 0 }
                      ]}
                      resizeMode="contain"
                      fadeDuration={0}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* 아이템 3 - 라벨만 */}
              <Image
                source={require('../assets/ui/common/settings-item3.png')}
                style={styles.settingsItem}
                resizeMode="contain"
              />

              {/* 아이템 4 - 라벨만 */}
              <Image
                source={require('../assets/ui/common/settings-item4.png')}
                style={styles.settingsItem}
                resizeMode="contain"
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
  settingsBackground: {
    width: width - 30,
    height: height * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  itemsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 30,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.7,
    position: 'relative',
  },
  settingsItem: {
    width: width * 0.7,
    height: 50,
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  toggleContainer: {
    position: 'relative',
    width: 60,
    height: 30,
  },
  toggleBg: {
    position: 'absolute',
    width: 60,
    height: 30,
  },
  toggleImage: {
    position: 'absolute',
    width: 25,
    height: 25 ,
    top: 2.5,
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
});
