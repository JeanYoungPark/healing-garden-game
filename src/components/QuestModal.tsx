// 🌱 Healing Garden - Quest Modal

import React from 'react';
import { StyleSheet, View, Modal, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { calcBackgroundSize } from '../utils/responsive';
import { modalStyles } from '../styles/modalStyles';

// 배경 크기 계산 (quest-bg: 1071 x 1483)
const { bgWidth, bgHeight } = calcBackgroundSize(1071, 1483);

// 모달 제목 크기 계산 (배경 너비 기준)
const modalTitleFontSize = bgWidth * 0.07;

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
        <View style={styles.container} pointerEvents="box-none">
          {/* 퀘스트 배경 */}
          <ImageBackground
            source={require('../assets/garden/props/quest-bg.png')}
            style={styles.questBackground}
            resizeMode="stretch"
          >
            {/* 모달 제목 */}
            <Text style={[styles.modalTitle, { fontSize: modalTitleFontSize }]}>일일 퀘스트</Text>

            {/* TODO: 퀘스트 내용 추가 */}

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
    top: bgHeight * 0.1,
    right: bgWidth * 0.07,
  },
  closeButtonText: modalStyles.closeButtonText,
  questBackground: {
    width: bgWidth,
    height: bgHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    position: 'absolute',
    top: '5.7%',
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
  },
});
