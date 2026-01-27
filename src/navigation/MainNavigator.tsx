// 🍓 Healing Garden - Main Bottom Tab Navigator

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
import { GardenScreen } from '../screens/GardenScreen';
import { ShopScreen } from '../screens/ShopScreen';
import { CollectionScreen } from '../screens/CollectionScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { COLORS } from '../utils/colors';

const Tab = createBottomTabNavigator();

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.text,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tab.Screen
        name="Garden"
        component={GardenScreen}
        options={{
          tabBarLabel: '농장',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🍓" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          tabBarLabel: '상점',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🛒" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Collection"
        component={CollectionScreen}
        options={{
          tabBarLabel: '도감',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📚" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: '설정',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// 탭 아이콘 컴포넌트
interface TabIconProps {
  emoji: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ emoji, focused }) => {
  return (
    <Text
      style={[
        styles.iconEmoji,
        { fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.6 },
      ]}
    >
      {emoji}
    </Text>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
    // 부드러운 그림자
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  tabBarIcon: {
    marginTop: 4,
  },
  iconEmoji: {
    textAlign: 'center',
  },
});
