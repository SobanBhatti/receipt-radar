import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { theme } from '../lib/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text variant="headlineSmall" style={styles.title}>
            Something went wrong
          </Text>
          <Text variant="bodyMedium" style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Button
            mode="contained"
            onPress={() => this.setState({ hasError: false, error: null })}
            style={styles.button}
          >
            Try Again
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: theme.colors.background,
  },
  title: {
    marginBottom: 16,
    color: theme.colors.error,
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  button: {
    marginTop: 16,
  },
});
