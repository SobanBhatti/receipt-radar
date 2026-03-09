import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, FAB, Dialog, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../lib/theme';
import { useShoppingListStore } from '../store/useShoppingListStore';
import { ShoppingList } from '../types';

export default function ShoppingListsScreen() {
  const navigation = useNavigation<any>();
  const { lists, addList, deleteList } = useShoppingListStore();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleCreateList = () => {
    if (!newListName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    const newList: ShoppingList = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: 'mock-user-id',
      name: newListName.trim(),
      created_at: new Date().toISOString(),
    };

    addList(newList);
    setNewListName('');
    setDialogVisible(false);
  };

  const handleDeleteList = (list: ShoppingList) => {
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${list.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteList(list.id),
        },
      ]
    );
  };

  const handleListPress = (list: ShoppingList) => {
    navigation.navigate('ShoppingListDetail', { listId: list.id });
  };

  const renderList = ({ item }: { item: ShoppingList }) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    return (
      <Card
        style={styles.listCard}
        mode="outlined"
        onPress={() => handleListPress(item)}
      >
        <Card.Content style={styles.listContent}>
          <View style={styles.listHeader}>
            <View style={styles.listInfo}>
              <MaterialCommunityIcons
                name="format-list-checks"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.listText}>
                <Text variant="titleMedium" style={styles.listName}>
                  {item.name}
                </Text>
                <Text variant="bodySmall" style={styles.listDate}>
                  Created {formatDate(item.created_at)}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="cart-outline"
        size={64}
        color={theme.colors.onSurfaceVariant}
      />
      <Text variant="titleLarge" style={styles.emptyTitle}>
        No Shopping Lists
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        Create your first shopping list to get started
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        renderItem={renderList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={lists.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmptyState}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setDialogVisible(true)}
        label="New List"
        color={theme.colors.onPrimary}
      />

      <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
        <Dialog.Title>Create Shopping List</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="List Name"
            value={newListName}
            onChangeText={setNewListName}
            mode="outlined"
            autoFocus
            onSubmitEditing={handleCreateList}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
          <Button onPress={handleCreateList} mode="contained">
            Create
          </Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyList: {
    flex: 1,
  },
  listCard: {
    marginBottom: 12,
  },
  listContent: {
    padding: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  listText: {
    marginLeft: 12,
    flex: 1,
  },
  listName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  listDate: {
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
