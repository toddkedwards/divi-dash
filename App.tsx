import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Import screens
import DashboardScreen from './src/screens/DashboardScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import DividendsScreen from './src/screens/DividendsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import shared types
import type { Portfolio, Position } from '@divly/data-models';
import { calculatePortfolioSummary } from '@divly/core';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            headerStyle: {
              backgroundColor: '#F8F9FA',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Tab.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{
              tabBarLabel: 'Dashboard',
              headerTitle: 'Divly Dashboard',
            }}
          />
          <Tab.Screen 
            name="Portfolio" 
            component={PortfolioScreen}
            options={{
              tabBarLabel: 'Portfolio',
              headerTitle: 'My Portfolio',
            }}
          />
          <Tab.Screen 
            name="Dividends" 
            component={DividendsScreen}
            options={{
              tabBarLabel: 'Dividends',
              headerTitle: 'Dividend Calendar',
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Settings',
              headerTitle: 'Settings',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 