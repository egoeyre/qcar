// src/navigation/OrdersStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrdersScreen } from '../screens/Orders/OrdersScreen';
import { OrderDetailScreen } from '../screens/Orders/OrderDetailScreen';

export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetail: { orderId: string };
};

const Stack = createNativeStackNavigator<OrdersStackParamList>();

export const OrdersStackNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="OrdersList"
      component={OrdersScreen}
      options={{ title: '订单列表' }}
    />
    <Stack.Screen
      name="OrderDetail"
      component={OrderDetailScreen}
      options={{ title: '订单详情' }}
    />
  </Stack.Navigator>
);
