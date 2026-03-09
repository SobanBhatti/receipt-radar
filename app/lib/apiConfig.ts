import { Platform } from 'react-native';

/**
 * API Configuration
 * 
 * For local development:
 * - Android Emulator: Use http://10.0.2.2:PORT (replace PORT with your API port, usually 5000 or 7000)
 * - iOS Simulator: Use http://localhost:PORT
 * - Physical Device: Use http://YOUR_COMPUTER_IP:PORT (find IP with ipconfig/ifconfig)
 * 
 * For HTTPS, you may need to configure certificate trust in development
 */
const getLocalApiUrl = () => {
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    // Update port to match your API's HTTP port (check launchSettings.json)
    return 'http://10.0.2.2:5099';
  } else {
    // iOS simulator can use localhost directly
    return 'http://localhost:5099';
  }
};

export const API_CONFIG = {
  baseUrl: __DEV__
    ? getLocalApiUrl() // Local development - adjust port as needed
    : 'https://api.receiptradar.com', // Production URL
  timeout: 10000, // 10 seconds
};
