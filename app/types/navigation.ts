/**
 * Navigation type definitions for React Navigation
 */

import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<MainStackParamList>;
};

export type MainStackParamList = {
  HomeTabs: NavigatorScreenParams<HomeTabParamList>;
  ReceiptDetail: { receiptId: string };
  UploadReceipt: undefined;
  ShoppingListDetail: { listId: string };
  PriceComparisonResult: { listId: string; shoppingListId: string };
};

export type HomeTabParamList = {
  Home: undefined;
  Receipts: undefined;
  Shopping: undefined;
  Analytics: undefined;
  Profile: undefined;
};
