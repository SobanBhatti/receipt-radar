import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { Text, Card, Button, Divider, Chip } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../lib/theme';
import { useReceiptStore } from '../store/useReceiptStore';
import { ReceiptWithItems } from '../types';

const DUMMY_USER_ID = '00000000-0000-0000-0000-000000000001'; // TODO: Get from auth context

export default function ReceiptDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const receiptId = route.params?.receiptId;
  const { getReceipt, deleteReceipt, fetchReceipt, loading } = useReceiptStore();
  const [receipt, setReceipt] = useState<ReceiptWithItems | null>(null);
  const [loadingReceipt, setLoadingReceipt] = useState(true);

  useEffect(() => {
    const loadReceipt = async () => {
      if (!receiptId) {
        setLoadingReceipt(false);
        return;
      }

      // Try to get from store first
      const cachedReceipt = getReceipt(receiptId);
      if (cachedReceipt) {
        setReceipt(cachedReceipt);
        setLoadingReceipt(false);
        return;
      }

      // Fetch from API if not in store
      try {
        const fetchedReceipt = await fetchReceipt(receiptId, DUMMY_USER_ID);
        setReceipt(fetchedReceipt);
      } catch (err) {
        console.error('Failed to fetch receipt:', err);
      } finally {
        setLoadingReceipt(false);
      }
    };

    loadReceipt();
  }, [receiptId, getReceipt, fetchReceipt]);

  if (loadingReceipt) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyMedium" style={styles.emptyText}>
            Loading receipt...
          </Text>
        </View>
      </View>
    );
  }

  if (!receiptId || !receipt) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text variant="titleLarge">Receipt not found</Text>
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `kr ${amount.toFixed(2)}`;
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReceipt(receiptId, DUMMY_USER_ID);
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete receipt');
            }
          },
        },
      ]
    );
  };

  const totalItems = receipt.items?.length || 0;
  const totalQuantity = receipt.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.content}>
        {/* Header Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <View style={styles.storeInfo}>
                <MaterialCommunityIcons
                  name="store"
                  size={32}
                  color={theme.colors.primary}
                />
                <View style={styles.storeText}>
                  <Text variant="headlineSmall" style={styles.storeName}>
                    {receipt.storeName}
                  </Text>
                  <Chip
                    mode="outlined"
                    compact
                    style={styles.storeChip}
                    textStyle={styles.storeChipText}
                  >
                    {receipt.storeChain}
                  </Chip>
                </View>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.metadata}>
              <View style={styles.metadataRow}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                  style={{ marginRight: 8 }}
                />
                <Text variant="bodyMedium" style={styles.metadataText}>
                  {formatDate(receipt.purchaseDate)}
                </Text>
              </View>
              <View style={styles.metadataRow}>
                <MaterialCommunityIcons
                  name="basket"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                  style={{ marginRight: 8 }}
                />
                <Text variant="bodyMedium" style={styles.metadataText}>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} ({totalQuantity} total)
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Receipt Image */}
        {receipt.receiptImageUrl && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Receipt Image
              </Text>
              <Image
                source={{ uri: receipt.receiptImageUrl }}
                style={styles.receiptImage}
                resizeMode="contain"
              />
            </Card.Content>
          </Card>
        )}

        {/* Items List */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Items
            </Text>
            {receipt.items && receipt.items.length > 0 ? (
              receipt.items.map((item, index) => (
                <View key={item.id}>
                  <View style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text variant="bodyLarge" style={styles.itemName}>
                        {item.productNameRaw}
                      </Text>
                      <Text variant="bodySmall" style={styles.itemDetails}>
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                      </Text>
                    </View>
                    <Text variant="titleMedium" style={styles.itemPrice}>
                      {formatCurrency(item.price)}
                    </Text>
                  </View>
                  {index < receipt.items.length - 1 && <Divider style={styles.itemDivider} />}
                </View>
              ))
            ) : (
              <Text variant="bodyMedium" style={styles.emptyItemsText}>
                No items found for this receipt
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Total */}
        <Card style={styles.totalCard}>
          <Card.Content>
            <View style={styles.totalRow}>
              <Text variant="headlineSmall" style={styles.totalLabel}>
                Total
              </Text>
              <Text variant="headlineMedium" style={styles.totalAmount}>
                {formatCurrency(receipt.totalAmount)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={handleDelete}
            textColor={theme.colors.error}
            icon="delete"
            style={styles.deleteButton}
          >
            Delete Receipt
          </Button>
        </View>
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
  card: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeText: {
    marginLeft: 12,
    flex: 1,
  },
  storeName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  storeChip: {
    alignSelf: 'flex-start',
  },
  storeChipText: {
    fontSize: 12,
  },
  divider: {
    marginVertical: 16,
  },
  metadata: {
    // gap replaced with marginBottom on children
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataText: {
    color: theme.colors.onSurfaceVariant,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  receiptImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceVariant,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDetails: {
    color: theme.colors.onSurfaceVariant,
  },
  itemPrice: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  itemDivider: {
    marginLeft: 0,
  },
  totalCard: {
    backgroundColor: theme.colors.primaryContainer,
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontWeight: 'bold',
    color: theme.colors.onPrimaryContainer,
  },
  totalAmount: {
    fontWeight: 'bold',
    color: theme.colors.onPrimaryContainer,
  },
  actions: {
    marginBottom: 32,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  backButton: {
    marginTop: 16,
  },
  emptyItemsText: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
