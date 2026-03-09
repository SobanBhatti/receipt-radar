import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Divider, ActivityIndicator, Chip } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../lib/theme';
import { useShoppingListStore } from '../store/useShoppingListStore';
import { findCheapestStore } from '../services/priceOptimizer';
import { PriceComparisonResult as PriceComparisonResultType } from '../types/services';
import { generateMockProducts } from '../utils/mockData';

export default function PriceComparisonResultScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const listId = route.params?.listId || route.params?.shoppingListId;
  const { getList } = useShoppingListStore();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<PriceComparisonResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const list = listId ? getList(listId) : null;
  const products = generateMockProducts();

  useEffect(() => {
    if (!list || list.items.length === 0) {
      setError('Shopping list is empty');
      setLoading(false);
      return;
    }

    const calculatePrices = async () => {
      try {
        const comparisonResult = await findCheapestStore(list.items);
        setResult(comparisonResult);
      } catch (err) {
        setError('Failed to calculate prices');
        // Error logged for debugging - keep for production error tracking
      } finally {
        setLoading(false);
      }
    };

    calculatePrices();
  }, [listId, list]);

  const formatCurrency = (amount: number) => {
    return `kr ${amount.toFixed(2)}`;
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const renderOption = (
    option: PriceComparisonResultType['option1'],
    title: string,
    description: string,
    isBest: boolean
  ) => {
    if (!option || option.stores.length === 0) return null;

    const savings = result
      ? result.option1.total - option.total
      : 0;

    return (
      <Card style={[styles.optionCard, isBest && styles.bestOption]}>
        <Card.Content>
          <View style={styles.optionHeader}>
            <View style={styles.optionTitleContainer}>
              <Text variant="titleLarge" style={styles.optionTitle}>
                {title}
              </Text>
              {isBest && (
                <Chip
                  icon="trophy"
                  style={styles.bestChip}
                  textStyle={styles.bestChipText}
                >
                  Best Deal
                </Chip>
              )}
            </View>
            <Text variant="headlineMedium" style={styles.optionTotal}>
              {formatCurrency(option.total)}
            </Text>
          </View>

          <Text variant="bodyMedium" style={styles.optionDescription}>
            {description}
          </Text>

          <Divider style={styles.divider} />

          <View style={styles.storesContainer}>
            <Text variant="titleSmall" style={styles.storesLabel}>
              Stores:
            </Text>
            <View style={styles.storesChips}>
              {option.stores.map((store) => (
                <Chip
                  key={store}
                  icon="store"
                  style={styles.storeChip}
                >
                  {store}
                </Chip>
              ))}
            </View>
          </View>

          {option.breakdown && option.breakdown.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <Text variant="titleSmall" style={styles.breakdownTitle}>
                Price Breakdown:
              </Text>
              {option.breakdown.map((item, index) => (
                <View key={index} style={styles.breakdownRow}>
                  <Text variant="bodyMedium" style={styles.breakdownProduct}>
                    {getProductName(item.product_id)}
                  </Text>
                  <View style={styles.breakdownRight}>
                    <Text variant="bodySmall" style={styles.breakdownStore}>
                      {item.store}
                    </Text>
                    <Text variant="bodyMedium" style={styles.breakdownPrice}>
                      {formatCurrency(item.price)}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {savings > 0 && !isBest && (
            <View style={styles.savingsContainer}>
              <Text variant="bodySmall" style={styles.savingsText}>
                Save {formatCurrency(savings)} compared to single store
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  if (!listId || !list) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={64}
            color={theme.colors.error}
          />
          <Text variant="titleLarge" style={styles.emptyTitle}>
            Shopping List Not Found
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Calculating best prices...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={64}
            color={theme.colors.error}
          />
          <Text variant="titleLarge" style={styles.emptyTitle}>
            {error}
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text variant="titleLarge">No results available</Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  const isOption2Best = result.option2.total < result.option1.total;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.content}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.headerTitle}>
              Price Comparison
            </Text>
            <Text variant="bodyMedium" style={styles.headerSubtitle}>
              {list.name}
            </Text>
            <Text variant="bodySmall" style={styles.headerInfo}>
              {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
            </Text>
          </Card.Content>
        </Card>

        {renderOption(
          result.option2,
          'Multi-Store Option',
          'Buy items from different stores to get the best prices',
          isOption2Best
        )}

        {renderOption(
          result.option1,
          'Single Store Option',
          'Buy everything from one store for convenience',
          !isOption2Best
        )}

        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          buttonColor={theme.colors.primary}
        >
          Back to Shopping List
        </Button>
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
  headerCard: {
    marginBottom: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  headerInfo: {
    color: theme.colors.onSurfaceVariant,
  },
  optionCard: {
    marginBottom: 16,
  },
  bestOption: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  optionHeader: {
    marginBottom: 8,
  },
  optionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  bestChip: {
    backgroundColor: theme.colors.primary,
    height: 24,
  },
  bestChipText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
  },
  optionTotal: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 4,
  },
  optionDescription: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  storesContainer: {
    marginBottom: 8,
  },
  storesLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
  storesChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  storeChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  breakdownTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  breakdownProduct: {
    flex: 1,
  },
  breakdownRight: {
    alignItems: 'flex-end',
  },
  breakdownStore: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
  },
  breakdownPrice: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  savingsContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 8,
  },
  savingsText: {
    color: theme.colors.onPrimaryContainer,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    color: theme.colors.onSurfaceVariant,
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
    textAlign: 'center',
  },
  backButton: {
    marginTop: 24,
  },
});
