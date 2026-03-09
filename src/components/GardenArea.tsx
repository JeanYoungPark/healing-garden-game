// 🍓 Healing Garden - Garden Area (Grid-based)

import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ImageBackground, Dimensions, Text, Animated } from 'react-native';
import { CapybaraCharacter } from './CapybaraCharacter';
import { WateringAnimation } from './WateringAnimation';
import { Plant, AnimalType, AnimalVisitor } from '../types';
import { PLANT_CONFIGS } from '../utils/plantConfigs';
import { PLANT_STAGE_IMAGES, PLANT_STAGE_SIZES } from '../utils/plantStageConfigs';
import { ANIMAL_CONFIGS } from '../utils/animalConfigs';
import { FENCE_CONFIGS } from '../utils/fenceConfigs';
import { PLOT_CONFIGS } from '../utils/plotConfigs';
import { RabbitCharacter } from './RabbitCharacter';
import { CatCharacter } from './CatCharacter';
import { OwlCharacter } from './OwlCharacter';
import { TurtleCharacter } from './TurtleCharacter';
import { RaccoonCharacter } from './RaccoonCharacter';

// 동물별 전용 컴포넌트 레지스트리 (없으면 이모지로 표시)
const ANIMAL_COMPONENTS: Partial<Record<AnimalType, React.FC<any>>> = {
  rabbit: RabbitCharacter,
  turtle: TurtleCharacter,
  raccoon: RaccoonCharacter,
  cat: CatCharacter,
  owl: ({ size }: { size?: number }) => <OwlCharacter size={size ?? 100} />,
};

const { width, height } = Dimensions.get('window');

interface GardenAreaProps {
  plants: Plant[];
  water: number;
  plantingMode: boolean;
  visitors: AnimalVisitor[];
  hasUnreadMail: boolean;
  hasNewDecoration: boolean;
  equippedFence: string; // 장착된 울타리 ID
  equippedPlot: string; // 장착된 밭 ID
  onPlantPress?: (plantId: string) => void;
  onSlotPress?: (slotIndex: number) => void;
  onWaterPlant?: (plantId: string) => void;
  onMailboxPress?: () => void;
  onVisitorPress?: (animalType: AnimalType) => void;
  onCapybaraPress?: () => void;
}

// 물 효과 적용된 실제 성장시간 계산 (최소 30%)
const getEffectiveTime = (plant: Plant): number => {
  const config = PLANT_CONFIGS[plant.type];
  const minTime = config.growthTime * 0.3;
  return Math.max(minTime, config.growthTime - plant.waterCount * config.waterBonus);
};

// 현재 성장 단계 계산 (시간 기반)
const calculateStage = (plant: Plant): number => {
  const effectiveTime = getEffectiveTime(plant);
  const stageDuration = effectiveTime / 4;
  const elapsed = (Date.now() - new Date(plant.plantedAt).getTime()) / (1000 * 60);
  return Math.min(3, Math.floor(elapsed / stageDuration));
};

// 남은 시간 계산
const getRemainingTime = (plant: Plant): string => {
  const effectiveTime = getEffectiveTime(plant);
  const elapsed = (Date.now() - new Date(plant.plantedAt).getTime()) / (1000 * 60);
  const remaining = Math.max(0, effectiveTime - elapsed);

  if (remaining === 0) return '수확 가능!';

  const hours = Math.floor(remaining / 60);
  const minutes = Math.ceil(remaining % 60);

  if (hours > 0) return `${hours}시간 ${minutes}분`;
  return `${minutes}분`;
};

// 떠오르는 시간 툴팁 컴포넌트
const FloatingTooltip: React.FC<{ text: string; topOffset: number; onDone: () => void }> = ({ text, topOffset, onDone }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -15,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start(() => onDoneRef.current());
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.tooltip,
        { top: topOffset, opacity, transform: [{ translateY }] },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.tooltipText}>{text}</Text>
    </Animated.View>
  );
};

export const GardenArea = forwardRef<View, GardenAreaProps>(({
  plants,
  water,
  plantingMode,
  visitors,
  hasUnreadMail,
  hasNewDecoration,
  equippedFence,
  equippedPlot,
  onPlantPress,
  onSlotPress,
  onWaterPlant,
  onMailboxPress,
  onVisitorPress,
  onCapybaraPress,
}, ref) => {
  // 30초마다 리렌더 → 식물 성장 단계 자동 갱신
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  const plotSize = width * 0.35;

  // 밭 스케일 애니메이션 (심기 시 톡 효과)
  const slotScales = useRef(
    Array.from({ length: 9 }, () => new Animated.Value(1))
  ).current;

  const bounceSlot = useCallback((slotIndex: number) => {
    const scale = slotScales[slotIndex];
    scale.setValue(1);
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.08,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slotScales]);

  // 떠오르는 툴팁 상태: 고유 ID로 각 인스턴스 독립 관리
  const tooltipIdRef = useRef(0);
  const [tooltips, setTooltips] = useState<{ id: number; slotIndex: number }[]>([]);

  // 슬롯에 심어진 식물 찾기
  const getPlantInSlot = (slotIndex: number): Plant | undefined => {
    return plants.find((p) => p.slotIndex === slotIndex);
  };

  // 물주기 애니메이션 상태
  const [wateringSlot, setWateringSlot] = useState<number | null>(null);

  const handlePlantTap = useCallback((slotIndex: number) => {
    tooltipIdRef.current += 1;
    const id = tooltipIdRef.current;
    setTooltips((prev) => [...prev, { id, slotIndex }]);
  }, []);

  const handleTooltipDone = useCallback((id: number) => {
    setTooltips((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleLongPress = useCallback((slotIndex: number) => {
    const plant = plants.find((p) => p.slotIndex === slotIndex);
    if (!plant) return;
    if (calculateStage(plant) >= 3) return;
    if (water <= 0) return;

    setWateringSlot(slotIndex);
    onWaterPlant?.(plant.id);
  }, [plants, water, onWaterPlant]);

  return (
    <View style={styles.container}>
      {/* 드롭 가능한 정원 영역 */}
      <View
        ref={ref}
        style={styles.gardenArea}
      >
        {/* 밭 기준 정렬 컨테이너 (화면 높이 무관하게 일정한 간격) */}
        <View style={styles.gardenContent}>
          {/* 캐릭터 영역 (카피바라 + 방문 동물 + 우체통) */}
          <View style={styles.charactersArea}>
            <TouchableOpacity
              style={styles.capybaraAnimation}
              activeOpacity={0.7}
              onPress={onCapybaraPress}
            >
              <CapybaraCharacter />
              {hasNewDecoration && (
                <View style={styles.capybaraAlert}>
                  {[
                    { top: -1.5, left: 0 },
                    { top: 1.5, left: 0 },
                    { top: 0, left: -1.5 },
                    { top: 0, left: 1.5 },
                  ].map((offset, i) => (
                    <Text key={i} style={[styles.mailAlertStroke, offset]}>!</Text>
                  ))}
                  <Text style={styles.mailAlertText}>!</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* beside-capybara visitors */}
            {(() => {
              let besideIndex = 0;
              return visitors
                .filter((v) => ANIMAL_CONFIGS[v.type].render.position === 'beside-capybara')
                .map((visitor) => {
                  const config = ANIMAL_CONFIGS[visitor.type];
                  const Component = ANIMAL_COMPONENTS[visitor.type];
                  const content = Component
                    ? <Component />
                    : <Text style={styles.visitorEmoji}>{config.emoji}</Text>;
                  const idx = besideIndex++;
                  return (
                    <TouchableOpacity
                      key={visitor.type}
                      style={[styles.visitorContainer, { left: width * 0.45 + idx * (width * 0.18) }]}
                      activeOpacity={0.7}
                      onPress={() => onVisitorPress?.(visitor.type)}
                    >
                      {content}
                    </TouchableOpacity>
                  );
                });
            })()}

            <TouchableOpacity
              style={styles.postBoxIcon}
              activeOpacity={0.7}
              onPress={onMailboxPress}
            >
              <Image
                source={require('../assets/garden/icons/post-box.png')}
                style={styles.postBoxImage}
                resizeMode="contain"
              />
              {hasUnreadMail && (
                <View style={styles.mailAlert}>
                  {[
                    { top: -1.5, left: 0 },
                    { top: 1.5, left: 0 },
                    { top: 0, left: -1.5 },
                    { top: 0, left: 1.5 },
                  ].map((offset, i) => (
                    <Text key={i} style={[styles.mailAlertStroke, offset]}>!</Text>
                  ))}
                  <Text style={styles.mailAlertText}>!</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* 밭과 울타리 그룹 */}
          <View style={styles.farmGroup}>
          {/* 3x3 밭 그리드 - 행별 View로 zIndex 제어 */}
          <View style={styles.gridContainer}>
            {[0, 1, 2].map((row) => (
              <View key={row} style={[styles.gridRow, { zIndex: row }]}>
                {[0, 1, 2].map((col) => {
                  const slotIndex = row * 3 + col;
                  const plant = getPlantInSlot(slotIndex);
                  const isEmpty = !plant;

                  return (
                    <TouchableOpacity
                      key={slotIndex}
                      activeOpacity={isEmpty ? 0.7 : 0.9}
                      delayLongPress={400}
                      onPress={() => {
                        if (isEmpty) {
                          bounceSlot(slotIndex);
                          onSlotPress?.(slotIndex);
                        } else if (plant && calculateStage(plant) >= 3) {
                          bounceSlot(slotIndex);
                          onPlantPress?.(plant.id);
                        } else {
                          handlePlantTap(slotIndex);
                        }
                      }}
                      onLongPress={() => {
                        if (!isEmpty) handleLongPress(slotIndex);
                      }}
                    >
                      <Animated.View style={{ transform: [{ scale: slotScales[slotIndex] }] }}>
                        <ImageBackground
                          source={PLOT_CONFIGS[equippedPlot]?.image || require('../assets/garden/props/farm-plot-01.png')}
                          style={[
                            styles.plotSlot,
                            {
                              width: plotSize,
                              height: plotSize * 0.6,
                            },
                            plantingMode && isEmpty && styles.plotSlotHighlight,
                          ]}
                          resizeMode="contain"
                        >
                          {/* 탭 시 떠오르는 남은 시간 툴팁 */}
                          {plant && tooltips
                            .filter((t) => t.slotIndex === slotIndex)
                            .map((t) => {
                              const stage = calculateStage(plant);
                              const typeSizes = PLANT_STAGE_SIZES[plant.type] || PLANT_STAGE_SIZES.carrot;
                              const sz = typeSizes[stage];
                              return (
                                <FloatingTooltip
                                  key={t.id}
                                  text={`${PLANT_CONFIGS[plant.type].name} ${getRemainingTime(plant)}`}
                                  topOffset={-plotSize * sz.h - (sz.tooltipOffset || 0)}
                                  onDone={() => handleTooltipDone(t.id)}
                                />
                              );
                            })}
                          {/* 식물이 심어져 있으면 이미지 표시 */}
                          {plant && (() => {
                            const stage = calculateStage(plant);
                            const typeImages = PLANT_STAGE_IMAGES[plant.type] || PLANT_STAGE_IMAGES.carrot;
                            const typeSizes = PLANT_STAGE_SIZES[plant.type] || PLANT_STAGE_SIZES.carrot;
                            const size = typeSizes[stage];
                            return (
                              <>
                                <Image
                                  source={typeImages[stage]}
                                  style={{
                                    position: 'absolute',
                                    width: plotSize * size.w,
                                    height: plotSize * size.h,
                                    ...(size.mb != null
                                      ? { bottom: plotSize * size.mb }
                                      : { top: plotSize * (size.mt ?? 0) }),
                                    left: (plotSize - plotSize * size.w) / 2 + plotSize * (size.ml ?? 0),
                                  }}
                                  resizeMode="contain"
                                />
                                <WateringAnimation
                                  visible={wateringSlot === slotIndex}
                                  plotSize={plotSize}
                                  onComplete={() => setWateringSlot(null)}
                                />
                              </>
                            );
                          })()}
                        </ImageBackground>
                      </Animated.View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* 울타리 - 밭 바로 아래 (장착된 울타리 렌더링) */}
          <View style={styles.fenceArea}>
            <Image
              source={FENCE_CONFIGS[equippedFence]?.image || require('../assets/garden/props/fence-01.png')}
              style={styles.fence}
              resizeMode="contain"
            />

            {/* Custom positioned visitors (울타리 기준) */}
            {visitors
              .filter((v) => ANIMAL_CONFIGS[v.type].render.position === 'custom')
              .map((visitor) => {
                const config = ANIMAL_CONFIGS[visitor.type];
                const Component = ANIMAL_COMPONENTS[visitor.type];
                const content = Component
                  ? <Component />
                  : <Text style={styles.visitorEmoji}>{config.emoji}</Text>;
                return (
                  <TouchableOpacity
                    key={visitor.type}
                    style={[styles.customVisitorContainer, config.render.containerStyle as any]}
                    activeOpacity={0.7}
                    onPress={() => onVisitorPress?.(visitor.type)}
                  >
                    {content}
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gardenArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gardenContent: {
    alignItems: 'center',
    width: '100%',
  },
  charactersArea: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  capybaraAnimation: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    width: 120,
    height: 120,
    zIndex: 5,
  },
  visitorContainer: {
    position: 'absolute',
    bottom: 20,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 6,
  },
  visitorEmoji: {
    fontSize: 40,
  },
  customVisitorContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postBoxIcon: {
    position: 'absolute',
    bottom: 10,
    right: '4%',
    width: 120,
    height: 120,
    zIndex: 5,
  },
  postBoxImage: {
    width: '100%',
    height: '100%',
  },
  farmGroup: {
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  gridContainer: {
    alignItems: 'center',
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plotSlot: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: -width * 0.025, // 가로 겹침으로 크기 확보
  },
  plotSlotHighlight: {
  },
  tooltip: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#f7e6c4',
    borderWidth: 2,
    borderColor: '#7a6854',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    zIndex: 20,
  },
  tooltipText: {
    fontSize: 12,
    fontFamily: 'Gaegu-Bold',
    color: '#7a6854',
  },
  fenceArea: {
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  fence: {
    width: width * 1,
    height: width * 1 * 0.19, // 이미지 비율 132/700
    marginTop: height * 0.04,
  },
  capybaraAlert: {
    position: 'absolute',
    top: -10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  mailAlert: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  mailAlertStroke: {
    position: 'absolute',
    fontSize: 28,
    fontFamily: 'Gaegu-Bold',
    color: '#7a6854',
  },
  mailAlertText: {
    fontSize: 28,
    fontFamily: 'Gaegu-Bold',
    color: '#FFD54F',
  },
});
