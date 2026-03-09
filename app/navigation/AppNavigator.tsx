import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../lib/theme';

// Screens (will be created in next chunks)
import LoginScreen from '../screens/Login';
import HomeDashboardScreen from '../screens/HomeDashboard';
import ReceiptHistoryScreen from '../screens/ReceiptHistory';
import ReceiptDetailScreen from '../screens/ReceiptDetail';
import UploadReceiptScreen from '../screens/UploadReceipt';
import ShoppingListsScreen from '../screens/ShoppingLists';
import ShoppingListDetailScreen from '../screens/ShoppingListDetail';
import AnalyticsScreen from '../screens/Analytics';
import PriceComparisonResultScreen from '../screens/PriceComparisonResult';
import ProfileScreen from '../screens/Profile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main stack navigator
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="HomeTabs" 
        component={HomeTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ReceiptDetail" 
        component={ReceiptDetailScreen}
        options={{ title: 'Receipt Details' }}
      />
      <Stack.Screen 
        name="UploadReceipt" 
        component={UploadReceiptScreen}
        options={{ title: 'Upload Receipt' }}
      />
      <Stack.Screen 
        name="ShoppingListDetail" 
        component={ShoppingListDetailScreen}
        options={{ title: 'Shopping List' }}
      />
      <Stack.Screen 
        name="PriceComparisonResult" 
        component={PriceComparisonResultScreen}
        options={{ title: 'Price Comparison' }}
      />
    </Stack.Navigator>
  );
}

// Bottom tab navigator
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Receipts"
        component={ReceiptHistoryScreen}
        options={{
          tabBarLabel: 'Receipts',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="receipt" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Shopping"
        component={ShoppingListsScreen}
        options={{
          tabBarLabel: 'Shopping',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root navigator (handles login flow)
const RootStack = createStackNavigator();

export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Main" component={MainStack} />
    </RootStack.Navigator>
  );
}
