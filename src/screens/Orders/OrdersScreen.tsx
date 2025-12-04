// src/screens/Orders/OrdersScreen.tsx
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useOrders } from '../../context/OrdersContext';
import { RideOrder, RideStatus } from '../../types/models';
import { OrdersStackParamList } from '../../navigation/OrdersStackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const statusLabel: Record<RideStatus, string> = {
  pending: '待接单',
  accepted: '已接单',
  in_progress: '进行中',
  completed: '已完成',
  canceled: '已取消',
};

const statusColor: Record<RideStatus, string> = {
  pending: '#f59e0b',
  accepted: '#3b82f6',
  in_progress: '#2563eb',
  completed: '#16a34a',
  canceled: '#6b7280',
};

export const OrdersScreen: React.FC = () => {
  const { orders, loading, refreshOrders } = useOrders();
  const navigation =
    useNavigation<NativeStackNavigationProp<OrdersStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      void refreshOrders();
    }, [refreshOrders])
  );

  const renderItem = ({ item }: { item: RideOrder }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('OrderDetail', {
          orderId: item.id,
        })
      }
    >
      <View style={styles.row}>
        <Text style={styles.cardTitle}>{item.pickup_address}</Text>
        <Text style={[styles.statusBadge, { backgroundColor: statusColor[item.status] }]}>
          {statusLabel[item.status]}
        </Text>
      </View>
      <Text style={styles.addressLine}>→ {item.dropoff_address}</Text>
      <View style={styles.row}>
        <Text style={styles.meta}>
          预估距离 {item.estimated_distance_km ?? '-'} km · 预估 ¥
          {item.estimated_price.toFixed(2)}
        </Text>
        <Text style={styles.meta}>
          {new Date(item.created_at).toLocaleString('zh-CN', {
            hour12: false,
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.hint}>正在加载订单...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.hint}>暂无订单，去下单页创建一单试试。</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 12 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  addressLine: {
    marginTop: 6,
    color: '#374151',
  },
  meta: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    color: '#6b7280',
    marginTop: 8,
  },
});
