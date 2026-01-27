// 🍓 Healing Garden - Seed Inventory (드래그 가능한 씨앗)

import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Animated, PanResponder, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/colors';
import { PlantType } from '../types';
import { PLANT_CONFIGS } from '../utils/plantConfigs';
import { SeedIcon } from './SeedIcon';

interface SeedInventoryProps {
  onSeedDrop: (seedType: PlantType, position: { x: number; y: number }) => void;
  gold: number;
}

export const SeedInventory: React.FC<SeedInventoryProps> = ({ onSeedDrop, gold }) => {
  const [dragging, setDragging] = useState(false);
  const [draggedSeed, setDraggedSeed] = useState<PlantType | null>(null);

  // 플로팅 씨앗 아이콘 위치
  const floatingPan = useRef(new Animated.ValueXY()).current;

  const createPanResponder = (seedType: PlantType) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setDragging(true);
        setDraggedSeed(seedType);

        // 터치 시작 위치로 플로팅 아이콘 이동
        floatingPan.setValue({
          x: evt.nativeEvent.pageX - 30, // 아이콘 중앙 정렬 (60/2)
          y: evt.nativeEvent.pageY - 30,
        });
      },
      onPanResponderMove: (evt) => {
        // 터치 위치로 플로팅 아이콘 이동
        floatingPan.setValue({
          x: evt.nativeEvent.pageX - 30,
          y: evt.nativeEvent.pageY - 30,
        });
      },
      onPanResponderRelease: (evt) => {
        setDragging(false);
        setDraggedSeed(null);

        // 화면 절대 좌표
        const dropX = evt.nativeEvent.pageX;
        const dropY = evt.nativeEvent.pageY;

        // 드롭 위치 전달
        onSeedDrop(seedType, { x: dropX, y: dropY });

        // 애니메이션 리셋
        floatingPan.setValue({ x: 0, y: 0 });
      },
    });
  };

  const strawberryPanResponder = createPanResponder('strawberry');
  const watermelonPanResponder = createPanResponder('watermelon');
  const peachPanResponder = createPanResponder('peach');
  const grapePanResponder = createPanResponder('grape');
  const applePanResponder = createPanResponder('apple');

  return (
    <>
      <View style={styles.container}>
        <View style={styles.inventoryPanel}>
          <Text style={styles.title}>씨앗 상자</Text>

          <View style={styles.seedList}>
            {/* 딸기 씨앗 */}
            <View
              style={styles.seedItem}
              {...strawberryPanResponder.panHandlers}
            >
              <View style={styles.seedIcon}>
                <SeedIcon size={28} />
              </View>
              <View style={styles.seedInfo}>
                <Text style={styles.seedName}>{PLANT_CONFIGS.strawberry.name}</Text>
                <Text style={styles.seedPrice}>
                  ✨ {PLANT_CONFIGS.strawberry.seedPrice}
                </Text>
              </View>
            </View>

            {/* 수박 씨앗 */}
            <View
              style={styles.seedItem}
              {...watermelonPanResponder.panHandlers}
            >
              <View style={styles.seedIcon}>
                <SeedIcon size={28} />
              </View>
              <View style={styles.seedInfo}>
                <Text style={styles.seedName}>{PLANT_CONFIGS.watermelon.name}</Text>
                <Text style={styles.seedPrice}>
                  ✨ {PLANT_CONFIGS.watermelon.seedPrice}
                </Text>
              </View>
            </View>

            {/* 복숭아 씨앗 */}
            <View
              style={styles.seedItem}
              {...peachPanResponder.panHandlers}
            >
              <View style={styles.seedIcon}>
                <SeedIcon size={28} />
              </View>
              <View style={styles.seedInfo}>
                <Text style={styles.seedName}>{PLANT_CONFIGS.peach.name}</Text>
                <Text style={styles.seedPrice}>
                  ✨ {PLANT_CONFIGS.peach.seedPrice}
                </Text>
              </View>
            </View>

            {/* 포도 씨앗 */}
            <View
              style={styles.seedItem}
              {...grapePanResponder.panHandlers}
            >
              <View style={styles.seedIcon}>
                <SeedIcon size={28} />
              </View>
              <View style={styles.seedInfo}>
                <Text style={styles.seedName}>{PLANT_CONFIGS.grape.name}</Text>
                <Text style={styles.seedPrice}>
                  ✨ {PLANT_CONFIGS.grape.seedPrice}
                </Text>
              </View>
            </View>

            {/* 사과 씨앗 */}
            <View
              style={styles.seedItem}
              {...applePanResponder.panHandlers}
            >
              <View style={styles.seedIcon}>
                <SeedIcon size={28} />
              </View>
              <View style={styles.seedInfo}>
                <Text style={styles.seedName}>{PLANT_CONFIGS.apple.name}</Text>
                <Text style={styles.seedPrice}>
                  ✨ {PLANT_CONFIGS.apple.seedPrice}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 드래그 중 안내 */}
        {dragging && (
          <View style={styles.dragHint}>
            <Text style={styles.dragHintText}>정원에 놓아주세요 🌱</Text>
          </View>
        )}
      </View>

      {/* 드래그 중 플로팅 씨앗 아이콘 - 화면 전체 레벨 */}
      {dragging && (
        <Animated.View
          style={[
            styles.floatingSeed,
            {
              left: floatingPan.x,
              top: floatingPan.y,
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.floatingSeedIcon}>
            <View style={styles.svgWrapper}>
              <SeedIcon size={45} />
            </View>
          </View>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inventoryPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  seedList: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  seedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  seedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seedInfo: {
    gap: 2,
  },
  seedName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  seedPrice: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  floatingSeed: {
    position: 'absolute',
    width: 60,
    height: 60,
    zIndex: 9999,
    elevation: 9999, // Android
  },
  floatingSeedIcon: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgWrapper: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHint: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dragHintText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
