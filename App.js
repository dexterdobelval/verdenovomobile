// Arquivo: App.js
// Caminho: App.js
// AuthProvider envolve toda a navegação para que qualquer tela acesse useAuth().
// O fluxo Splash → Login → Main é controlado pelo estado isAuthenticated do contexto.

import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { colors } from './src/theme';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen   from './src/screens/HomeScreen';
import MapaScreen   from './src/screens/MapaScreen';
import DicasScreen  from './src/screens/DicasScreen';
import SobreScreen  from './src/screens/SobreScreen';
import LoginScreen  from './src/screens/LoginScreen';
import DrawerMenu   from './src/components/DrawerMenu';

const Stack  = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerMenu {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Início"  component={HomeScreen} />
      <Drawer.Screen name="Mapa"    component={MapaScreen} />
      <Drawer.Screen name="Dicas"   component={DicasScreen} />
      <Drawer.Screen name="Sobre"   component={SobreScreen} />
    </Drawer.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainDrawer} />
        ) : (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login"  component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
});
