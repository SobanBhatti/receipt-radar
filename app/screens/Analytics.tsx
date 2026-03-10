import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../lib/theme';
import {
  fetchSpendingSummary,
  fetchMonthlySpending,
  fetchStoreSpending,
  fetchTopProducts,
} from '../services/analyticsService';
import { formatCurrency, formatMonth } from '../utils/analytics';
import { SpendingSummary, MonthlySpending, StoreSpending, TopProduct } from '../types/analytics';

const DUMMY_USER_ID = '00000000-0000-0000-0000-000000000001'; // TODO: Get from auth context

export default function AnalyticsScreen() {
  const [summary, setSummary] = useState<SpendingSummary | null>(null);
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending[]>([]);
  const [storeSpending, setStoreSpending] = useState<StoreSpending[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async () => {
    try {
      const [summaryData, monthlyData, storeData, topProductsData] = await Promise.all([
        fetchSpendingSummary(DUMMY_USER_ID),
        fetchMonthlySpending(DUMMY_USER_ID),
        fetchStoreSpending(DUMMY_USER_ID),
        fetchTopProducts(DUMMY_USER_ID, 5),
      ]);

      setSummary(summaryData);
      setMonthlySpending(monthlyData);
      setStoreSpending(storeData);
      setTopProducts(topProductsData);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  const hasData = summary !== null && (summary.thisYear > 0 || monthlySpending.length > 0);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyMedium" style={styles.emptyText}>
            Loading analytics...
          </Text>
        </View>
      </View>
    );
  }

  if (!hasData) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="chart-line"
            size={64}
            color={theme.colors.onSurfaceVariant}
          />
          <Text variant="titleLarge" style={styles.emptyTitle}>
            No Analytics Data
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Upload some receipts to see your spending analytics
          </Text>
        </View>
      </View>
    );
  }

  const displaySummary = summary || {
    thisMonth: 0,
    lastMonth: 0,
    thisYear: 0,
    averagePerMonth: 0,
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <Card style={[styles.summaryCard, { marginRight: 12 }]}>
            <Card.Content>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                This Month
              </Text>
              <Text variant="headlineSmall" style={styles.summaryValue}>
                {formatCurrency(displaySummary.thisMonth)}
              </Text>
            </Card.Content>
          </Card>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Last Month
              </Text>
              <Text variant="headlineSmall" style={styles.summaryValue}>
                {formatCurrency(displaySummary.lastMonth)}
              </Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.summaryRow}>
          <Card style={[styles.summaryCard, { marginRight: 12 }]}>
            <Card.Content>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                This Year
              </Text>
              <Text variant="headlineSmall" style={styles.summaryValue}>
                {formatCurrency(displaySummary.thisYear)}
              </Text>
            </Card.Content>
          </Card>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Avg/Month
              </Text>
              <Text variant="headlineSmall" style={styles.summaryValue}>
                {formatCurrency(displaySummary.averagePerMonth)}
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Monthly Spending - Simple List */}
        {monthlySpending.length > 0 && (
          <Card style={styles.chartCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.chartTitle}>
                Monthly Spending
              </Text>
              {monthlySpending.map((item) => (
                <View key={item.month} style={styles.monthRow}>
                  <Text variant="bodyLarge">{formatMonth(item.month)}</Text>
                  <Text variant="titleMedium" style={styles.monthAmount}>
                    {formatCurrency(item.total)}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Store Spending - Simple List */}
        {storeSpending.length > 0 && (
          <Card style={styles.chartCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.chartTitle}>
                Spending by Store
              </Text>
              {storeSpending.slice(0, 5).map((item) => (
                <View key={item.storeChain} style={styles.storeRow}>
                  <Text variant="bodyLarge">{item.storeChain}</Text>
                  <Text variant="titleMedium" style={styles.storeAmount}>
                    {formatCurrency(item.total)}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Top Products */}
        {topProducts.length > 0 && (
          <Card style={styles.chartCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.chartTitle}>
                Top Products
              </Text>
              {topProducts.map((product, index) => (
                <View key={product.productName} style={styles.productRow}>
                  <View style={styles.productInfo}>
                    <Text variant="bodyLarge" style={styles.productName}>
                      {index + 1}. {product.productName}
                    </Text>
                    <Text variant="bodySmall" style={styles.productDetails}>
                      {product.purchaseCount} purchases
                    </Text>
                  </View>
                  <Text variant="titleMedium" style={styles.productAmount}>
                    {formatCurrency(product.totalSpent)}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
  },
  summaryLabel: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  summaryValue: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  chartCard: {
    marginBottom: 16,
  },
  chartTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  monthAmount: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  storeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  storeAmount: {
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontWeight: '500',
    marginBottom: 4,
  },
  productDetails: {
    color: theme.colors.onSurfaceVariant,
  },
  productAmount: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
