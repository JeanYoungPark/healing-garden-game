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

  useEffect(() => {
    // 앱 시작 시 물방울 충전 & 올빼미 편지 & 랜덤 동물 체크
    rechargeWater();
    checkForOwlMail();
    checkForRandomVisitors();

    // 앱이 포그라운드로 돌아올 때 물방울 충전 & 올빼미 편지 & 랜덤 동물 체크
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        rechargeWater();
        checkForOwlMail();
        checkForRandomVisitors();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [rechargeWater, checkForOwlMail, checkForRandomVisitors]);

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
