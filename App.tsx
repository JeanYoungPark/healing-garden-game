/**
 * 🌱 Healing Garden
 * 힐링 정원 키우기 게임
 *
 * @format
 */

import React, { useEffect, useRef } from 'react';
import { StatusBar, AppState, AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GardenScreen } from './src/screens/GardenScreen';
import { useGardenStore } from './src/stores/gardenStore';

const Stack = createNativeStackNavigator();

function App() {
  const appState = useRef(AppState.currentState);
  const rechargeWater = useGardenStore((state) => state.rechargeWater);
  const checkForOwlMail = useGardenStore((state) => state.checkForOwlMail);
  const checkForRandomVisitors = useGardenStore((state) => state.checkForRandomVisitors);
  const incrementVisitCountIfNoHarvest = useGardenStore((state) => state.incrementVisitCountIfNoHarvest);
  const removeOwlIfDaytime = useGardenStore((state) => state.removeOwlIfDaytime);
  const updateLastAppOpenDate = useGardenStore((state) => state.updateLastAppOpenDate);

  useEffect(() => {
    // Hydration 완료 대기 또는 즉시 실행
    let unsubFinishHydration: (() => void) | undefined;

    const initializeApp = () => {
      // 앱 시작 시 물방울 충전 & 올빼미 편지 & 랜덤 동물 체크 & 방문 카운터 증가
      rechargeWater();
      checkForOwlMail();
      incrementVisitCountIfNoHarvest(); // 수확 없이 접속 체크 (고양이 트리거)
      removeOwlIfDaytime(); // 낮이면 올빼미 제거
      checkForRandomVisitors();
      updateLastAppOpenDate(); // 앱 실행 날짜 기록 (거북이 미접속 트리거용, checkForNewVisitors 후 호출)
    };

    if (useGardenStore.persist.hasHydrated()) {
      initializeApp();
    } else {
      unsubFinishHydration = useGardenStore.persist.onFinishHydration(() => {
        initializeApp();
      });
    }

    // 앱이 포그라운드로 돌아올 때 물방울 충전 & 올빼미 편지 (방문 카운터는 앱 시작 시에만)
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        rechargeWater();
        checkForOwlMail();
        removeOwlIfDaytime(); // 낮이면 올빼미 제거
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      if (unsubFinishHydration) unsubFinishHydration();
    };
  }, [rechargeWater, checkForOwlMail, checkForRandomVisitors, incrementVisitCountIfNoHarvest, removeOwlIfDaytime, updateLastAppOpenDate]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Garden" component={GardenScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
