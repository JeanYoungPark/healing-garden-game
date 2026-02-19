// 🌱 Healing Garden - Confirm Modal

import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* 반투명 배경 */}
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onCancel}
        />

        {/* 확인 창 */}
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* 버튼 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: '#FFF8EE',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#D4B896',
    padding: screenWidth * 0.06,
    width: screenWidth * 0.75,
    alignItems: 'center',
  },
  title: {
    fontSize: screenWidth * 0.055,
    fontFamily: 'Gaegu-Bold',
    color: '#7a6854',
    marginBottom: screenWidth * 0.03,
  },
  message: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
    textAlign: 'center',
    lineHeight: screenWidth * 0.065,
    marginBottom: screenWidth * 0.05,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: screenWidth * 0.03,
  },
  button: {
    flex: 1,
    paddingVertical: screenWidth * 0.03,
    paddingHorizontal: screenWidth * 0.04,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#BDBDBD',
  },
  confirmButton: {
    backgroundColor: '#81C784',
    borderColor: '#66BB6A',
  },
  cancelButtonText: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Gaegu-Bold',
    color: '#757575',
  },
  confirmButtonText: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Gaegu-Bold',
    color: '#FFFFFF',
  },
});
