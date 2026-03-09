import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../lib/theme';

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const handleLogin = () => {
    // Dummy login - just navigate to main app
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="displaySmall" style={styles.title}>
          ReceiptRadar
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Track your receipts and find the best prices
        </Text>
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          buttonColor={theme.colors.primary}
        >
          Continue
        </Button>
        <Text variant="bodySmall" style={styles.note}>
          Authentication will be implemented later
        </Text>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  surface: {
    padding: 32,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 32,
  },
  note: {
    marginTop: 16,
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
});
