import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Position } from '@divly/data-models';

const mockPositions: Position[] = [
  {
    id: '1',
    portfolioId: 'portfolio-1',
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    shares: 100,
    averageCost: 150.00,
    currentPrice: 175.00,
    totalValue: 17500,
    totalCost: 15000,
    gainLoss: 2500,
    gainLossPercent: 16.67,
    sector: 'Technology',
    currency: 'USD',
    lastUpdated: new Date(),
  },
  {
    id: '2',
    portfolioId: 'portfolio-1',
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    shares: 50,
    averageCost: 280.00,
    currentPrice: 320.00,
    totalValue: 16000,
    totalCost: 14000,
    gainLoss: 2000,
    gainLossPercent: 14.29,
    sector: 'Technology',
    currency: 'USD',
    lastUpdated: new Date(),
  },
];

export default function PortfolioScreen() {
  const renderPosition = ({ item }: { item: Position }) => (
    <View style={styles.positionCard}>
      <View style={styles.positionHeader}>
        <View>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.companyName}>{item.companyName}</Text>
        </View>
        <View style={styles.priceInfo}>
          <Text style={styles.currentPrice}>${item.currentPrice.toFixed(2)}</Text>
          <Text style={[
            styles.gainLoss,
            { color: item.gainLoss >= 0 ? '#34C759' : '#FF3B30' }
          ]}>
            {item.gainLoss >= 0 ? '+' : ''}${item.gainLoss.toFixed(2)} ({item.gainLossPercent.toFixed(2)}%)
          </Text>
        </View>
      </View>
      <View style={styles.positionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Shares:</Text>
          <Text style={styles.detailValue}>{item.shares}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Avg Cost:</Text>
          <Text style={styles.detailValue}>${item.averageCost.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Value:</Text>
          <Text style={styles.detailValue}>${item.totalValue.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mockPositions}
        renderItem={renderPosition}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  positionCard: {
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
  positionHeader: {
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
  priceInfo: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  gainLoss: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  positionDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
});
