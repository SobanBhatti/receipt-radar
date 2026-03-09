import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../lib/theme';
import { useReceiptStore } from '../store/useReceiptStore';
import { calculateSpendingSummary, formatCurrency } from '../utils/analytics';
import ReceiptCard from '../components/ReceiptCard';
import { Receipt } from '../types';

export default function HomeDashboardScreen() {
  const navigation = useNavigation<any>();
  const { receipts } = useReceiptStore();

  // Calculate spending summary
  const summary = useMemo(() => calculateSpendingSummary(receipts), [receipts]);

  // Get latest receipts (last 5, sorted by date descending)
  const latestReceipts = useMemo(() => {
    return [...receipts]
      .sort((a, b) => {
        const dateA = new Date(a.purchase_date).getTime();
        const dateB = new Date(b.purchase_date).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [receipts]);

  const handleReceiptPress = (receipt: Receipt) => {
    navigation.navigate('ReceiptDetail', { receiptId: receipt.id });
  };

  const handleViewAllReceipts = () => {
    navigation.navigate('Receipts');
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.content}>
        {/* Spending Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryHeader}>
              <View>
                <Text variant="titleMedium" style={styles.summaryLabel}>
                  This Month's Spending
                </Text>
                <Text variant="headlineMedium" style={styles.summaryAmount}>
                  {formatCurrency(summary.thisMonth)}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="wallet"
                size={48}
                color={theme.colors.primary}
              />
            </View>
            
            {summary.lastMonth > 0 && (
              <View style={styles.comparisonRow}>
                <Text variant="bodySmall" style={styles.comparisonLabel}>
                  Last month: {formatCurrency(summary.lastMonth)}
                </Text>
                {summary.thisMonth > summary.lastMonth && (
                  <View style={styles.increaseBadge}>
                    <MaterialCommunityIcons
                      name="arrow-up"
                      size={16}
                      color={theme.colors.error}
                    />
                    <Text variant="bodySmall" style={styles.increaseText}>
                      {formatCurrency(summary.thisMonth - summary.lastMonth)} more
                    </Text>
                  </View>
                )}
                {summary.thisMonth < summary.lastMonth && (
                  <View style={styles.decreaseBadge}>
                    <MaterialCommunityIcons
                      name="arrow-down"
                      size={16}
                      color={theme.colors.primary}
                    />
                    <Text variant="bodySmall" style={styles.decreaseText}>
                      {formatCurrency(summary.lastMonth - summary.thisMonth)} less
                    </Text>
                  </View>
                )}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('UploadReceipt')}
            style={styles.uploadButton}
            buttonColor={theme.colors.primary}
            icon={({ size, color }) => (
              <MaterialCommunityIcons name="camera" size={size} color={color} />
            )}
            contentStyle={styles.buttonContent}
          >
            Upload Receipt
          </Button>
          
          <View style={styles.secondaryActions}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Shopping')}
              style={styles.secondaryButton}
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="cart" size={size} color={color} />
              )}
            >
              Shopping Lists
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Analytics')}
              style={styles.secondaryButton}
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="chart-line" size={size} color={color} />
              )}
            >
              Analytics
            </Button>
          </View>
        </View>

        {/* Latest Receipts */}
        <Card style={styles.receiptsCard}>
          <Card.Content>
            <View style={styles.receiptsHeader}>
              <Text variant="titleLarge" style={styles.receiptsTitle}>
                Latest Receipts
              </Text>
              {receipts.length > 5 && (
                <TouchableOpacity onPress={handleViewAllReceipts}>
                  <Text variant="bodyMedium" style={styles.viewAllText}>
                    View All
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {latestReceipts.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="receipt"
                  size={64}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  No Receipts Yet
                </Text>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  Upload your first receipt to start tracking your spending
                </Text>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('UploadReceipt')}
                  style={styles.emptyButton}
                  buttonColor={theme.colors.primary}
                >
                  Upload Receipt
                </Button>
              </View>
            ) : (
              <View style={styles.receiptsList}>
                {latestReceipts.map((receipt) => (
                  <ReceiptCard
                    key={receipt.id}
                    receipt={receipt}
                    onPress={() => handleReceiptPress(receipt)}
                  />
                ))}
                {receipts.length > 5 && (
                  <Button
                    mode="text"
                    onPress={handleViewAllReceipts}
                    style={styles.viewAllButton}
                    textColor={theme.colors.primary}
                  >
                    View All {receipts.length} Receipts
                  </Button>
                )}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Stats Summary */}
        {receipts.length > 0 && (
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={32}
                  color={theme.colors.primary}
                />
                <View style={styles.statText}>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    This Year
                  </Text>
                  <Text variant="titleMedium" style={styles.statValue}>
                    {formatCurrency(summary.thisYear)}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <MaterialCommunityIcons
                  name="chart-bar"
                  size={32}
                  color={theme.colors.primary}
                />
                <View style={styles.statText}>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Avg/Month
                  </Text>
                  <Text variant="titleMedium" style={styles.statValue}>
                    {formatCurrency(summary.averagePerMonth)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>
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
  summaryCard: {
    marginBottom: 16,
    backgroundColor: theme.colors.primaryContainer,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    color: theme.colors.onPrimaryContainer,
    marginBottom: 4,
  },
  summaryAmount: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  comparisonLabel: {
    color: theme.colors.onPrimaryContainer,
  },
  increaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  increaseText: {
    color: theme.colors.onErrorContainer,
    marginLeft: 4,
  },
  decreaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  decreaseText: {
    color: theme.colors.onPrimaryContainer,
    marginLeft: 4,
  },
  quickActions: {
    marginBottom: 16,
  },
  uploadButton: {
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  receiptsCard: {
    marginBottom: 16,
  },
  receiptsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptsTitle: {
    fontWeight: 'bold',
  },
  viewAllText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  receiptsList: {
    marginTop: 8,
  },
  viewAllButton: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 12,
    flex: 1,
  },
  statLabel: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  statValue: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
