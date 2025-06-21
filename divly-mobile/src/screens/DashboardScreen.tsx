import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import shared types and calculations
import type { PortfolioSummary, Position } from '@divly/data-models';
import { calculatePortfolioSummary } from '@divly/core';

// Mock data for demonstration
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
    dividendYield: 0.5,
    annualDividendPerShare: 0.88,
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
    dividendYield: 0.8,
    annualDividendPerShare: 2.56,
    sector: 'Technology',
    currency: 'USD',
    lastUpdated: new Date(),
  },
];

export default function DashboardScreen() {
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = () => {
    // Using shared business logic
    const summary = calculatePortfolioSummary(mockPositions);
    setPortfolioSummary(summary);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPortfolioData();
    setRefreshing(false);
  };

  if (!portfolioSummary) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Portfolio Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Value</Text>
            <Text style={styles.summaryValue}>
              ${portfolioSummary.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Gain/Loss</Text>
            <Text style={[
              styles.summaryValue,
              { color: portfolioSummary.totalGainLoss >= 0 ? '#34C759' : '#FF3B30' }
            ]}>
              ${portfolioSummary.totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              ({portfolioSummary.totalGainLossPercent.toFixed(2)}%)
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Annual Dividend Income</Text>
            <Text style={styles.summaryValue}>
              ${portfolioSummary.annualDividendIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Dividend Yield</Text>
            <Text style={styles.summaryValue}>
              {portfolioSummary.dividendYield.toFixed(2)}%
            </Text>
          </View>
        </View>

        <View style={styles.performanceCard}>
          <Text style={styles.cardTitle}>Top Performers</Text>
          {portfolioSummary.topPerformers.slice(0, 3).map((position) => (
            <View key={position.id} style={styles.positionRow}>
              <View style={styles.positionInfo}>
                <Text style={styles.positionSymbol}>{position.symbol}</Text>
                <Text style={styles.positionName}>{position.companyName}</Text>
              </View>
              <View style={styles.positionMetrics}>
                <Text style={[styles.positionGain, { color: '#34C759' }]}>
                  +{position.gainLossPercent.toFixed(2)}%
                </Text>
                <Text style={styles.positionValue}>
                  ${position.totalValue.toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
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
    padding: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#8E8E93',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  performanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1C1C1E',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  positionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  positionInfo: {
    flex: 1,
  },
  positionSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  positionName: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  positionMetrics: {
    alignItems: 'flex-end',
  },
  positionGain: {
    fontSize: 16,
    fontWeight: '600',
  },
  positionValue: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
});
