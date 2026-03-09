import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  Button,
  TextInput,
  Dialog,
  Searchbar,
  Chip,
  IconButton,
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../lib/theme';
import { useShoppingListStore } from '../store/useShoppingListStore';
import { generateMockProducts } from '../utils/mockData';
import { Product, ShoppingListItem } from '../types';

export default function ShoppingListDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const listId = route.params?.listId;
  const {
    getList,
    updateList,
    addItemToList,
    updateListItem,
    removeItemFromList,
  } = useShoppingListStore();

  const list = listId ? getList(listId) : null;
  const [searchQuery, setSearchQuery] = useState('');
  const [productDialogVisible, setProductDialogVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [editNameDialogVisible, setEditNameDialogVisible] = useState(false);
  const [editName, setEditName] = useState('');

  const allProducts = useMemo(() => generateMockProducts(), []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return allProducts.slice(0, 10); // Show first 10 when no search

    const query = searchQuery.toLowerCase();
    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  }, [allProducts, searchQuery]);

  if (!listId || !list) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text variant="titleLarge">List not found</Text>
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

  const handleAddProduct = (product: Product) => {
    setSelectedProduct(product);
    setQuantity('1');
    setProductDialogVisible(true);
  };

  const handleConfirmAddProduct = () => {
    if (!selectedProduct) return;

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    const newItem: ShoppingListItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      list_id: listId,
      product_id: selectedProduct.id,
      quantity: qty,
    };

    addItemToList(newItem);
    setProductDialogVisible(false);
    setSelectedProduct(null);
    setQuantity('1');
    setSearchQuery('');
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromList(itemId);
    } else {
      updateListItem(itemId, { quantity: newQuantity });
    }
  };

  const handleEditName = () => {
    setEditName(list.name);
    setEditNameDialogVisible(true);
  };

  const handleSaveName = () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'List name cannot be empty');
      return;
    }
    updateList(listId, { name: editName.trim() });
    setEditNameDialogVisible(false);
  };

  const getProductName = (productId: string) => {
    const product = allProducts.find((p) => p.id === productId);
    return product?.name || 'Unknown Product';
  };

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
              <View style={styles.titleContainer}>
                <Text variant="headlineSmall" style={styles.title}>
                  {list.name}
                </Text>
                <Text variant="bodySmall" style={styles.itemCount}>
                  {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
                </Text>
              </View>
              <IconButton
                icon="pencil"
                size={20}
                onPress={handleEditName}
                iconColor={theme.colors.primary}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Add Product Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Add Products
            </Text>
            <Searchbar
              placeholder="Search products..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchbar}
              iconColor={theme.colors.onSurfaceVariant}
            />
            {searchQuery.trim() && (
              <View style={styles.productSuggestions}>
                {filteredProducts.map((product) => (
                  <Chip
                    key={product.id}
                    onPress={() => handleAddProduct(product)}
                    style={styles.productChip}
                    icon="plus"
                  >
                    {product.name}
                  </Chip>
                ))}
                {filteredProducts.length === 0 && (
                  <Text variant="bodySmall" style={styles.noResults}>
                    No products found
                  </Text>
                )}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Items List */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Items
            </Text>
            {list.items.length === 0 ? (
              <View style={styles.emptyItems}>
                <MaterialCommunityIcons
                  name="cart-off"
                  size={48}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text variant="bodyMedium" style={styles.emptyText}>
                  No items yet. Search and add products above.
                </Text>
              </View>
            ) : (
              list.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text variant="bodyLarge" style={styles.itemName}>
                      {getProductName(item.product_id)}
                    </Text>
                  </View>
                  <View style={styles.quantityControls}>
                    <IconButton
                      icon="minus"
                      size={20}
                      onPress={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      iconColor={theme.colors.primary}
                    />
                    <Text variant="titleMedium" style={styles.quantity}>
                      {item.quantity}
                    </Text>
                    <IconButton
                      icon="plus"
                      size={20}
                      onPress={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      iconColor={theme.colors.primary}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => removeItemFromList(item.id)}
                      iconColor={theme.colors.error}
                    />
                  </View>
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Price Optimization Button */}
        {list.items.length > 0 && (
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate('PriceComparisonResult', {
                listId: listId,
                shoppingListId: listId,
              })
            }
            buttonColor={theme.colors.primary}
            icon="store-search"
            style={styles.optimizeButton}
          >
            Find Cheapest Store
          </Button>
        )}
      </View>

      {/* Add Product Dialog */}
      <Dialog
        visible={productDialogVisible}
        onDismiss={() => setProductDialogVisible(false)}
      >
        <Dialog.Title>Add Product</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyLarge" style={styles.dialogProductName}>
            {selectedProduct?.name}
          </Text>
          <TextInput
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            mode="outlined"
            keyboardType="numeric"
            style={styles.quantityInput}
            autoFocus
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setProductDialogVisible(false)}>Cancel</Button>
          <Button onPress={handleConfirmAddProduct} mode="contained">
            Add
          </Button>
        </Dialog.Actions>
      </Dialog>

      {/* Edit Name Dialog */}
      <Dialog
        visible={editNameDialogVisible}
        onDismiss={() => setEditNameDialogVisible(false)}
      >
        <Dialog.Title>Edit List Name</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="List Name"
            value={editName}
            onChangeText={setEditName}
            mode="outlined"
            autoFocus
            onSubmitEditing={handleSaveName}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setEditNameDialogVisible(false)}>Cancel</Button>
          <Button onPress={handleSaveName} mode="contained">
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCount: {
    color: theme.colors.onSurfaceVariant,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  searchbar: {
    marginBottom: 12,
    elevation: 0,
  },
  productSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  noResults: {
    color: theme.colors.onSurfaceVariant,
    padding: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    minWidth: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyItems: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 16,
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
  optimizeButton: {
    marginTop: 8,
    marginBottom: 32,
  },
  dialogProductName: {
    fontWeight: '600',
    marginBottom: 16,
  },
  quantityInput: {
    marginBottom: 8,
  },
});
