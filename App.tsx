/**
 * 🌱 Healing Garden
 * 힐링 정원 키우기 게임
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainNavigator } from './src/navigation/MainNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
