// Arquivo: app.config.js
// Caminho: app.config.js
// Deps: expo-constants@~18.0.13, expo-secure-store@~15.0.8
// Define apiUrl diferente para dev (emulador Android usa 10.0.2.2) e produção.
// Lido em src/services/api.ts via Constants.expoConfig.extra.apiUrl

export default ({ config }) => ({
  ...config,
  name:    'verdenovo',
  slug:    'verdenovo',
  version: '1.0.0',
  orientation: 'portrait',
  icon:    './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image:      './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 'Usado para mostrar pontos de coleta próximos a você.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
  },
  web: { favicon: './assets/favicon.png' },
  plugins: ['expo-font', 'expo-secure-store'],
  extra: {
    // Troque pelo IP da sua máquina ao testar em dispositivo físico
    // Emulador Android: 10.0.2.2 | Dispositivo físico: IP local (ex: 192.168.1.100)
    // Produção: URL pública do backend no Somee
    apiUrl: process.env.API_URL ?? 'http://10.0.2.2:3001/api',
  },
});
