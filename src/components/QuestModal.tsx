// 🌱 Healing Garden - Quest Modal

import React from 'react';
import { StyleSheet, View, Image, Modal, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface QuestModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QuestModal: React.FC<QuestModalProps> = ({ visible, onClose }) => {
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
        {/* 퀘스트 컨텐츠 */}
        <View style={styles.container}>
          {/* 퀘스트 배경 */}
          <ImageBackground
            source={require('../assets/garden/props/quest-bg.png')}
            style={styles.questBackground}
            resizeMode="contain"
          >
            {/* TODO: 퀘스트 내용 추가 */}
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
  questBackground: {
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
});
