import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, Card, Button, Divider, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../lib/theme';
import { useUserStore } from '../store/useUserStore';
import { useReceiptStore } from '../store/useReceiptStore';
import { useShoppingListStore } from '../store/useShoppingListStore';
import { calculateSpendingSummary, formatCurrency } from '../utils/analytics';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useUserStore();
  const { receipts } = useReceiptStore();
  const { lists } = useShoppingListStore();

  const summary = useMemo(() => calculateSpendingSummary(receipts), [receipts]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const stats = [
    {
      label: 'Total Receipts',
      value: receipts.length.toString(),
      icon: 'receipt',
      color: theme.colors.primary,
    },
    {
      label: 'Shopping Lists',
      value: lists.length.toString(),
      icon: 'cart',
      color: theme.colors.secondary,
    },
    {
      label: 'This Year',
      value: formatCurrency(summary.thisYear),
      icon: 'calendar-month',
      color: theme.colors.tertiary,
    },
    {
      label: 'Avg/Month',
      value: formatCurrency(summary.averagePerMonth),
      icon: 'chart-bar',
      color: theme.colors.primary,
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.content}>
        {/* User Info Card */}
        <Card style={styles.userCard}>
          <Card.Content style={styles.userContent}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons
                name="account-circle"
                size={80}
                color={theme.colors.primary}
              />
            </View>
            <Text variant="headlineSmall" style={styles.userName}>
              {user?.email || 'Guest User'}
            </Text>
            <Text variant="bodyMedium" style={styles.userEmail}>
              {user?.email || 'Not logged in'}
            </Text>
            {user?.createdAt && (
              <Text variant="bodySmall" style={styles.userJoined}>
                Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <MaterialCommunityIcons
                  name={stat.icon as any}
                  size={32}
                  color={stat.color}
                />
                <Text variant="titleLarge" style={styles.statValue}>
                  {stat.value}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  {stat.label}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Settings Section */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Settings
            </Text>
            <Divider style={styles.divider} />

            <List.Item
              title="Receipt History"
              description="View all your receipts"
              left={(props) => (
                <List.Icon {...props} icon="receipt" color={theme.colors.primary} />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('Receipts')}
            />

            <List.Item
              title="Analytics"
              description="View spending analytics"
              left={(props) => (
                <List.Icon {...props} icon="chart-line" color={theme.colors.primary} />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('Analytics')}
            />

            <List.Item
              title="Shopping Lists"
              description="Manage your shopping lists"
              left={(props) => (
                <List.Icon {...props} icon="cart" color={theme.colors.primary} />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('Shopping')}
            />
          </Card.Content>
        </Card>

        {/* About Section */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              About
            </Text>
            <Divider style={styles.divider} />

            <List.Item
              title="App Version"
              description="1.0.0"
              left={(props) => (
                <List.Icon {...props} icon="information" color={theme.colors.onSurfaceVariant} />
              )}
            />

            <List.Item
              title="Privacy Policy"
              description="How we handle your data"
              left={(props) => (
                <List.Icon {...props} icon="shield-check" color={theme.colors.onSurfaceVariant} />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy will be available soon.')}
            />

            <List.Item
              title="Terms of Service"
              description="Terms and conditions"
              left={(props) => (
                <List.Icon {...props} icon="file-document" color={theme.colors.onSurfaceVariant} />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Terms of Service', 'Terms of service will be available soon.')}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        {user && (
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            buttonColor={theme.colors.error}
            icon="logout"
          >
            Logout
          </Button>
        )}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text variant="bodySmall" style={styles.appInfoText}>
            ReceiptRadar
          </Text>
          <Text variant="bodySmall" style={styles.appInfoText}>
            Track your receipts and find the best prices
          </Text>
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
  userCard: {
    marginBottom: 16,
  },
  userContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  userJoined: {
    color: theme.colors.onSurfaceVariant,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    marginHorizontal: '1%',
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  appInfoText: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 4,
  },
});
