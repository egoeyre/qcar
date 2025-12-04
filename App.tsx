// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrdersProvider } from './src/context/OrdersContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OrdersProvider>
          <AppNavigator />
        </OrdersProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
