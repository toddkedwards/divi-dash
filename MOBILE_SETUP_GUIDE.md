# Divly Mobile App Setup Guide

## Overview
This guide will help you set up and develop the Divly mobile app using React Native, sharing core business logic with the web app.

## Prerequisites

### Development Environment
1. **Node.js** (v18 or higher)
2. **React Native CLI**
3. **Xcode** (for iOS development - macOS only)
4. **Android Studio** (for Android development)
5. **CocoaPods** (for iOS dependencies)

### Installation Commands
```bash
# Install React Native CLI globally
npm install -g react-native-cli

# Install CocoaPods (macOS only)
sudo gem install cocoapods
```

## Project Initialization

### 1. Create React Native Project
```bash
# Navigate to your main project directory
cd /path/to/your/divly-project

# Create mobile app
npx react-native init DivlyMobile --template react-native-template-typescript
cd DivlyMobile

# Install additional dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
npm install react-native-vector-icons react-native-svg
npm install @react-native-async-storage/async-storage
npm install react-native-push-notification
```

### 2. iOS Setup
```bash
cd ios
pod install
cd ..
```

### 3. Android Setup
Add to `android/settings.gradle`:
```gradle
include ':react-native-vector-icons'
project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')
```

## Project Structure

### Recommended Directory Structure
```
DivlyMobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Cross-platform components
│   │   ├── ios/            # iOS-specific components
│   │   └── android/        # Android-specific components
│   ├── screens/            # App screens/pages
│   │   ├── Dashboard/
│   │   ├── Portfolio/
│   │   ├── Settings/
│   │   └── Auth/
│   ├── navigation/         # Navigation configuration
│   ├── services/          # API calls and external services
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   └── constants/         # App constants
├── shared/                # Shared packages (symlinked)
│   ├── @divly/core/
│   ├── @divly/data-models/
│   └── @divly/utils/
├── android/               # Android-specific configuration
├── ios/                   # iOS-specific configuration
└── __tests__/            # Test files
```

## Shared Code Integration

### 1. Link Shared Packages
Create symbolic links to share code with web app:

```bash
# From DivlyMobile directory
mkdir shared
cd shared

# Create symlinks to shared packages
ln -s ../../packages/core @divly-core
ln -s ../../packages/data-models @divly-data-models
ln -s ../../packages/utils @divly-utils
```

### 2. Configure Metro Bundler
Create/update `metro.config.js`:

```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  watchFolders: [
    path.resolve(__dirname, 'shared'),
    path.resolve(__dirname, '../packages'),
  ],
  resolver: {
    alias: {
      '@divly/core': path.resolve(__dirname, 'shared/@divly-core'),
      '@divly/data-models': path.resolve(__dirname, 'shared/@divly-data-models'),
      '@divly/utils': path.resolve(__dirname, 'shared/@divly-utils'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

## Core Features Implementation

### 1. Authentication Screen
```typescript
// src/screens/Auth/LoginScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const LoginScreen: React.FC = () => {
  const handleGoogleSignIn = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Divly</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#18b64a',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
```

### 2. Portfolio Dashboard Screen
```typescript
// src/screens/Dashboard/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { calculatePortfolioSummary } from '@divly/core';
import { Portfolio, PortfolioSummary } from '@divly/data-models';

const DashboardScreen: React.FC = () => {
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);

  useEffect(() => {
    // Load portfolio data and calculate summary
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    // Implementation to load data from Firebase/local storage
    // const positions = await getPositions();
    // const summary = calculatePortfolioSummary(positions);
    // setPortfolioSummary(summary);
  };

  if (!portfolioSummary) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Portfolio Overview</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Value</Text>
        <Text style={styles.value}>
          ${portfolioSummary.totalValue.toLocaleString()}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Gain/Loss</Text>
        <Text style={[
          styles.value,
          { color: portfolioSummary.totalGainLoss >= 0 ? '#10b981' : '#ef4444' }
        ]}>
          ${portfolioSummary.totalGainLoss.toLocaleString()} 
          ({portfolioSummary.totalGainLossPercent.toFixed(2)}%)
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Annual Income</Text>
        <Text style={styles.value}>
          ${portfolioSummary.projectedAnnualIncome.toLocaleString()}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DashboardScreen;
```

### 3. Navigation Setup
```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import PortfolioScreen from '../screens/Portfolio/PortfolioScreen';
import CalendarScreen from '../screens/Calendar/CalendarScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import LoginScreen from '../screens/Auth/LoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = '';
        
        switch (route.name) {
          case 'Dashboard':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Portfolio':
            iconName = focused ? 'briefcase' : 'briefcase-outline';
            break;
          case 'Calendar':
            iconName = focused ? 'calendar' : 'calendar-outline';
            break;
          case 'Settings':
            iconName = focused ? 'settings' : 'settings-outline';
            break;
        }
        
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#18b64a',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Portfolio" component={PortfolioScreen} />
    <Tab.Screen name="Calendar" component={CalendarScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
```

## Firebase Configuration

### 1. iOS Configuration
1. Download `GoogleService-Info.plist` from Firebase Console
2. Add to `ios/DivlyMobile/GoogleService-Info.plist`
3. Update `ios/DivlyMobile/Info.plist` with URL schemes

### 2. Android Configuration
1. Download `google-services.json` from Firebase Console
2. Add to `android/app/google-services.json`
3. Update `android/build.gradle` and `android/app/build.gradle`

## Development Workflow

### 1. Start Metro Bundler
```bash
npx react-native start
```

### 2. Run on iOS
```bash
npx react-native run-ios
```

### 3. Run on Android
```bash
npx react-native run-android
```

### 4. Development Tips
- Use **Flipper** for debugging
- Enable **Hot Reload** for faster development
- Use **React Native Debugger** for Redux/state management
- Test on both iOS and Android regularly

## Testing Strategy

### 1. Unit Tests
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react-native jest
```

### 2. E2E Tests
```bash
# Install Detox for E2E testing
npm install --save-dev detox
```

### 3. Test Shared Logic
Since business logic is shared, focus mobile tests on:
- UI interactions
- Navigation flows
- Platform-specific features
- Performance

## Deployment

### 1. iOS App Store
1. Configure app signing in Xcode
2. Archive and upload to App Store Connect
3. Submit for review

### 2. Google Play Store
1. Generate signed APK
2. Upload to Play Console
3. Submit for review

## Next Steps

1. **Complete the core screens** (Dashboard, Portfolio, Calendar)
2. **Implement push notifications** for dividend alerts
3. **Add biometric authentication** (Face ID/Touch ID/Fingerprint)
4. **Optimize performance** with proper state management
5. **Add offline support** with local data caching
6. **Implement real-time price updates**
7. **Add camera functionality** for receipt scanning

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Firebase for React Native](https://rnfirebase.io/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)

This setup provides a solid foundation for building the Divly mobile app while sharing core business logic with the web application. 