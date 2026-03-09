import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2ecc71',
    primaryContainer: '#d4edda',
    secondary: '#27ae60',
    secondaryContainer: '#c3e6cb',
    tertiary: '#229954',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceVariant: '#f5f5f5',
    error: '#e74c3c',
    errorContainer: '#fadbd8',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#155724',
    onSecondary: '#ffffff',
    onSecondaryContainer: '#155724',
    onTertiary: '#ffffff',
    onBackground: '#000000',
    onSurface: '#000000',
    onSurfaceVariant: '#666666',
    onError: '#ffffff',
    onErrorContainer: '#721c24',
    outline: '#cccccc',
    outlineVariant: '#e0e0e0',
  },
};

export type AppTheme = typeof theme;
