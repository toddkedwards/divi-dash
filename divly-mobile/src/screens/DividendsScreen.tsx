import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Dividend } from '@divly/data-models';

const mockDividends: Dividend[] = [
  {
    id: '1',
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    amount: 0.22,
    currency: 'USD',
    exDate: new Date('2024-02-09'),
    payDate: new Date('2024-02-15'),
    frequency: 'quarterly',
    type: 'regular',
    status: 'confirmed',
  },
  {
    id: '2',
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    amount: 0.64,
    currency: 'USD',
    exDate: new Date('2024-02-14'),
    payDate: new Date('2024-03-14'),
    frequency: 'quarterly',
    type: 'regular',
    status: 'confirmed',
  },
];

export default function DividendsScreen() {
  const renderDividend = ({ item }: { item: Dividend }) => (
    <View style={styles.dividendCard}>
      <View style={styles.dividendHeader}>
        <View>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.companyName}>{item.companyName}</Text>
        </View>
        <View style={styles.amountInfo}>
          <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
          <Text style={styles.frequency}>{item.frequency}</Text>
        </View>
      </View>
      <View style={styles.dividendDetails}>
        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>Ex-Date:</Text>
          <Text style={styles.dateValue}>{item.exDate.toLocaleDateString()}</Text>
        </View>
        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>Pay Date:</Text>
          <Text style={styles.dateValue}>{item.payDate.toLocaleDateString()}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming Dividends</Text>
        <Text style={styles.headerSubtitle}>Your next dividend payments</Text>
      </View>
      <FlatList
        data={mockDividends}
        renderItem={renderDividend}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
      return '#34C759';
    case 'announced':
      return '#FF9500';
    case 'paid':
      return '#007AFF';
    default:
      return '#8E8E93';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  dividendCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dividendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  companyName: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34C759',
  },
  frequency: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  dividendDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  statusLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
});
