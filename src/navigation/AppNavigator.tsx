// src/navigation/AppNavigator.tsx
import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { MainTabNavigator } from './MainTabNavigator';
import { ActivityIndicator, View } from 'react-native';

const RootStack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const { session, loading } = useAuth();
  const navigationRef = useRef<any>(null);
  const hasInitialized = useRef(false);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        if (!hasInitialized.current) {
          hasInitialized.current = true;
          const initialRoute = session ? 'Main' : 'Auth';
          navigationRef.current?.resetRoot({
            index: 0,
            routes: [{ name: initialRoute }],
          });
        }
      }}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen
          name="Auth"
          component={AuthStack}
          options={{ gestureEnabled: false }}
        />
        <RootStack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
