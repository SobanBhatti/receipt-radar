import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, Searchbar, Chip, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../lib/theme';
import { useReceiptStore } from '../store/useReceiptStore';
import ReceiptCard from '../components/ReceiptCard';
import { Receipt } from '../types';

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

const DUMMY_USER_ID = '00000000-0000-0000-0000-000000000001'; // TODO: Get from auth context

export default function ReceiptHistoryScreen() {
  const navigation = useNavigation<any>();
  const { receipts, loading, error, fetchReceipts, refreshReceipts } = useReceiptStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch receipts on mount
  useEffect(() => {
    fetchReceipts(DUMMY_USER_ID).catch((err) => {
      console.error('Failed to fetch receipts:', err);
    });
  }, [fetchReceipts]);

  const filteredAndSortedReceipts = useMemo(() => {
    let filtered = [...receipts];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (receipt) =>
          receipt.storeName.toLowerCase().includes(query) ||
          receipt.storeChain.toLowerCase().includes(query)
      );
    }

    // Sort receipts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        case 'date-asc':
          return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
        case 'amount-desc':
          return b.totalAmount - a.totalAmount;
        case 'amount-asc':
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [receipts, searchQuery, sortBy]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshReceipts(DUMMY_USER_ID);
    } catch (err) {
      console.error('Failed to refresh receipts:', err);
    } finally {
      setRefreshing(false);
    }
  }, [refreshReceipts]);

  const handleReceiptPress = (receipt: Receipt) => {
    navigation.navigate('ReceiptDetail', { receiptId: receipt.id });
  };

  const renderReceipt = ({ item }: { item: Receipt }) => (
    <ReceiptCard receipt={item} onPress={() => handleReceiptPress(item)} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="receipt"
        size={64}
        color={theme.colors.onSurfaceVariant}
      />
      <Text variant="titleLarge" style={styles.emptyTitle}>
        No Receipts Yet
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        Upload your first receipt to get started tracking your spending
      </Text>
    </View>
  );

  if (loading && receipts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Loading receipts...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search receipts..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={theme.colors.onSurfaceVariant}
        />
        <View style={styles.sortContainer}>
          <Text variant="bodySmall" style={styles.sortLabel}>
            Sort by:
          </Text>
          <View style={styles.chips}>
            <Chip
              selected={sortBy === 'date-desc'}
              onPress={() => setSortBy('date-desc')}
              style={styles.chip}
              compact
            >
              Newest
            </Chip>
            <Chip
              selected={sortBy === 'date-asc'}
              onPress={() => setSortBy('date-asc')}
              style={styles.chip}
              compact
            >
              Oldest
            </Chip>
            <Chip
              selected={sortBy === 'amount-desc'}
              onPress={() => setSortBy('amount-desc')}
              style={styles.chip}
              compact
            >
              Highest
            </Chip>
            <Chip
              selected={sortBy === 'amount-asc'}
              onPress={() => setSortBy('amount-asc')}
              style={styles.chip}
              compact
            >
              Lowest
            </Chip>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredAndSortedReceipts}
        renderItem={renderReceipt}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          filteredAndSortedReceipts.length === 0 ? styles.emptyList : styles.list
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <FAB
        icon="camera"
        style={styles.fab}
        onPress={() => navigation.navigate('UploadReceipt')}
        label="Upload"
        color={theme.colors.onPrimary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    color: theme.colors.onSurfaceVariant,
  },
  header: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  searchbar: {
    marginBottom: 12,
    elevation: 0,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sortLabel: {
    marginRight: 8,
    color: theme.colors.onSurfaceVariant,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyList: {
    flex: 1,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});
