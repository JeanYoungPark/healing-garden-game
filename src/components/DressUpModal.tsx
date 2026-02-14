// 🎨 Healing Garden - Dress Up Modal (카피바라 꾸미기)

import React from 'react';
import { StyleSheet, View, Image, Modal, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { modalStyles } from '../styles/modalStyles';
import { calcBackgroundSize, calcElementSize } from '../utils/responsive';
import { useGardenStore } from '../stores/gardenStore';
import { DECORATION_CONFIGS } from '../utils/decorationConfigs';

// 배경 크기 계산 (dressup-bg: 890 x 1215)
const { bgWidth, bgHeight } = calcBackgroundSize(890, 1215);

// 카피바라 이미지 크기 (575 x 391)
const { width: kapyWidth, height: kapyHeight } = calcElementSize(bgWidth, 0.6, 575, 391);

// 모달 제목 크기
const modalTitleFontSize = bgWidth * 0.07;

// 슬롯 크기 (3열 그리드)
const SLOT_COLUMNS = 3;
const slotGap = bgWidth * 0.03;
const slotSize = (bgWidth * 0.75 - slotGap * (SLOT_COLUMNS - 1)) / SLOT_COLUMNS;

// 전체 슬롯 개수
const TOTAL_SLOTS = 6;

// 모든 꾸미기 아이템 키 목록
const ALL_DECORATION_IDS = Object.keys(DECORATION_CONFIGS);

interface DressUpModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DressUpModal: React.FC<DressUpModalProps> = ({ visible, onClose }) => {
  const decorations = useGardenStore((state) => state.decorations);
  const equippedDecorations = useGardenStore((state) => state.equippedDecorations);
  const toggleEquipDecoration = useGardenStore((state) => state.toggleEquipDecoration);

  // 보유 아이템 id 세트
  const ownedIds = new Set(decorations.map((d) => d.id));

  // 슬롯 데이터
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => {
    const id = ALL_DECORATION_IDS[i];
    if (id && ownedIds.has(id)) {
      return { id, owned: true };
    }
    return { id: id || null, owned: false };
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.container}>
          <ImageBackground
            source={require('../assets/garden/props/dressup-bg.png')}
            style={styles.dressupBackground}
            resizeMode="contain"
          >
            {/* 모달 제목 */}
            <Text style={styles.modalTitle}>꾸미기</Text>

            {/* 상단: 카피바라 + 장착 아이템 오버레이 */}
            <View style={styles.topSection}>
              <View style={styles.kapybaraWrapper}>
                <Image
                  source={require('../assets/garden/props/dressup-kapybara.png')}
                  style={styles.kapybaraImage}
                  resizeMode="contain"
                />
                {/* 장착된 아이템 오버레이 (config 기반) */}
                {equippedDecorations.map((id) => {
                  const config = DECORATION_CONFIGS[id];
                  if (!config?.modalOverlay) return null;
                  const overlay = config.modalOverlay;
                  const { width: ow, height: oh } = calcElementSize(
                    kapyWidth, overlay.widthRatio, overlay.imageWidth, overlay.imageHeight
                  );
                  return (
                    <Image
                      key={id}
                      source={overlay.image}
                      style={{
                        position: 'absolute',
                        width: ow,
                        height: oh,
                        top: kapyHeight * overlay.topRatio,
                        right: kapyWidth * overlay.rightRatio,
                      }}
                      resizeMode="contain"
                    />
                  );
                })}
              </View>
            </View>

            {/* 하단: 꾸미기 슬롯 그리드 + 좌우 화살표 */}
            <View style={styles.bottomSection}>
              <View style={styles.slotRow}>
                {/* 왼쪽 화살표 */}
                <TouchableOpacity style={styles.arrowButton} activeOpacity={0.6}>
                  <Text style={styles.arrowText}>{'<'}</Text>
                </TouchableOpacity>

                <View style={styles.slotGrid}>
                  {slots.map((slot, index) => {
                    const config = slot.id ? DECORATION_CONFIGS[slot.id] : null;
                    const isEquipped = slot.id ? equippedDecorations.includes(slot.id) : false;
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.slot,
                          isEquipped && styles.slotEquipped,
                        ]}
                        activeOpacity={slot.owned ? 0.7 : 1}
                        onPress={() => {
                          if (slot.owned && slot.id) {
                            toggleEquipDecoration(slot.id);
                          }
                        }}
                      >
                        {slot.owned && config ? (
                          config.image ? (
                            <Image
                              source={config.image}
                              style={styles.slotItemImage}
                              resizeMode="contain"
                            />
                          ) : (
                            <Text style={styles.slotEmoji}>{config.emoji}</Text>
                          )
                        ) : (
                          <Image
                            source={require('../assets/ui/common/slot-closed.png')}
                            style={styles.slotClosedImage}
                            resizeMode="contain"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* 오른쪽 화살표 */}
                <TouchableOpacity style={styles.arrowButton} activeOpacity={0.6}>
                  <Text style={styles.arrowText}>{'>'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 닫기 버튼 */}
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
    top: bgHeight * 0.03,
    right: bgWidth * 0.05,
  },
  closeButtonText: modalStyles.closeButtonText,
  dressupBackground: {
    width: bgWidth,
    height: bgHeight,
    alignItems: 'center',
  },
  modalTitle: {
    position: 'absolute',
    top: '10%',
    fontSize: modalTitleFontSize,
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
  },
  topSection: {
    marginTop: bgHeight * 0.17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kapybaraWrapper: {
    position: 'relative',
  },
  kapybaraImage: {
    width: kapyWidth,
    height: kapyHeight,
    marginTop: bgHeight * 0.06,
  },
  bottomSection: {
    marginTop: bgHeight * 0.05,
    alignItems: 'center',
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: bgWidth * 0.02,
  },
  arrowButton: {
    width: bgWidth * 0.08,
    height: bgWidth * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: bgWidth * 0.07,
    fontFamily: 'Gaegu-Bold',
    color: '#C9B9A8',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: bgWidth * 0.75,
    gap: slotGap,
    justifyContent: 'center',
  },
  slot: {
    width: slotSize,
    height: slotSize,
    backgroundColor: '#F7E8DA',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotEquipped: {
    borderWidth: 2.5,
    borderColor: '#A1887F',
  },
  slotEmoji: {
    fontSize: slotSize * 0.45,
  },
  slotItemImage: {
    width: slotSize * 0.6,
    height: slotSize * 0.6,
  },
  slotClosedImage: {
    width: slotSize * 0.6,
    height: slotSize * 0.6,
  },
});
