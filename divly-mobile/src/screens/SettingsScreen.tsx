import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const handleSettingPress = (setting: string) => {
    Alert.alert('Settings', `${setting} pressed - Coming soon!`);
  };

  const SettingItem = ({ title, subtitle, onPress }: { 
    title: string; 
    subtitle?: string; 
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.settingArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="Profile"
              subtitle="Manage your profile information"
              onPress={() => handleSettingPress('Profile')}
            />
            <SettingItem
              title="Subscription"
              subtitle="Manage your Divly Pro subscription"
              onPress={() => handleSettingPress('Subscription')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="Notifications"
              subtitle="Configure push notifications and alerts"
              onPress={() => handleSettingPress('Notifications')}
            />
            <SettingItem
              title="Currency"
              subtitle="USD - United States Dollar"
              onPress={() => handleSettingPress('Currency')}
            />
            <SettingItem
              title="Theme"
              subtitle="Light, Dark, or System"
              onPress={() => handleSettingPress('Theme')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="Data Sync"
              subtitle="Sync data across devices"
              onPress={() => handleSettingPress('Data Sync')}
            />
            <SettingItem
              title="Privacy Settings"
              subtitle="Control your data sharing preferences"
              onPress={() => handleSettingPress('Privacy Settings')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="Help & FAQ"
              subtitle="Get help and find answers"
              onPress={() => handleSettingPress('Help & FAQ')}
            />
            <SettingItem
              title="Contact Support"
              subtitle="Get in touch with our team"
              onPress={() => handleSettingPress('Contact Support')}
            />
            <SettingItem
              title="About"
              subtitle="Version 1.0.0"
              onPress={() => handleSettingPress('About')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  sectionContent: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  settingArrow: {
    fontSize: 20,
    color: '#C7C7CC',
    fontWeight: 'bold',
  },
});
