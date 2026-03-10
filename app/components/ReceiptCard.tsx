import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Receipt } from '../types';
import { theme } from '../lib/theme';

interface ReceiptCardProps {
  receipt: Receipt;
  onPress: () => void;
}

export default function ReceiptCard({ receipt, onPress }: ReceiptCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `kr ${amount.toFixed(2)}`;
  };

  const getStoreIcon = (chain: string) => {
    const chainLower = chain.toLowerCase();
    if (chainLower.includes('kiwi')) return 'store';
    if (chainLower.includes('rema')) return 'store';
    if (chainLower.includes('coop')) return 'store';
    if (chainLower.includes('meny')) return 'store';
    if (chainLower.includes('spar')) return 'store';
    return 'store-outline';
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card} mode="outlined">
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <View style={styles.storeInfo}>
              <MaterialCommunityIcons
                name={getStoreIcon(receipt.storeChain)}
                size={24}
                color={theme.colors.primary}
                style={styles.icon}
              />
              <View style={styles.storeText}>
                <Text variant="titleMedium" style={styles.storeName}>
                  {receipt.storeName}
                </Text>
                <Text variant="bodySmall" style={styles.storeChain}>
                  {receipt.storeChain}
                </Text>
              </View>
            </View>
            <View style={styles.amountContainer}>
              <Text variant="titleLarge" style={styles.amount}>
                {formatCurrency(receipt.totalAmount)}
              </Text>
            </View>
          </View>
          <View style={styles.footer}>
            <View style={styles.dateContainer}>
              <MaterialCommunityIcons
                name="calendar"
                size={16}
                color={theme.colors.onSurfaceVariant}
                style={{ marginRight: 6 }}
              />
              <Text variant="bodySmall" style={styles.date}>
                {formatDate(receipt.purchaseDate)}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  storeInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  storeText: {
    flex: 1,
  },
  storeName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  storeChain: {
    color: theme.colors.onSurfaceVariant,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    color: theme.colors.onSurfaceVariant,
  },
});
