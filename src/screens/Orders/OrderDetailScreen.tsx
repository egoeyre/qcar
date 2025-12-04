// src/screens/Orders/OrderDetailScreen.tsx
import React, { useMemo } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OrdersStackParamList } from '../../navigation/OrdersStackNavigator';
import { useOrders } from '../../context/OrdersContext';
import { RideStatus } from '../../types/models';

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

export const OrderDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<OrdersStackParamList, 'OrderDetail'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<OrdersStackParamList>>();
  const { getOrderById, updateOrderStatus } = useOrders();
  const order = getOrderById(route.params.orderId);

  const actions = useMemo(() => {
    if (!order) return [];
    const items: { label: string; status: RideStatus }[] = [];

    if (order.status === 'pending') {
      items.push({ label: '标记为已接单', status: 'accepted' });
      items.push({ label: '取消订单', status: 'canceled' });
    } else if (order.status === 'accepted') {
      items.push({ label: '开始行程', status: 'in_progress' });
      items.push({ label: '取消订单', status: 'canceled' });
    } else if (order.status === 'in_progress') {
      items.push({ label: '完成订单', status: 'completed' });
    }

    return items;
  }, [order]);

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>未找到该订单</Text>
      </View>
    );
  }

  const handleUpdate = async (status: RideStatus) => {
    await updateOrderStatus(order.id, status, {
      finalPrice:
        status === 'completed' ? order.final_price ?? order.estimated_price : undefined,
    });
    Alert.alert('状态更新', `已标记为：${statusLabel[status]}`);
    navigation.setParams({ orderId: order.id });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.block}>
        <Text style={styles.title}>订单状态</Text>
        <Text
          style={[
            styles.statusText,
            { color: statusColor[order.status] ?? '#111827' },
          ]}
        >
          {statusLabel[order.status]}
        </Text>
        <Text style={styles.meta}>创建时间：{new Date(order.created_at).toLocaleString()}</Text>
        {order.started_at && (
          <Text style={styles.meta}>开始时间：{new Date(order.started_at).toLocaleString()}</Text>
        )}
        {order.completed_at && (
          <Text style={styles.meta}>
            完成时间：{new Date(order.completed_at).toLocaleString()}
          </Text>
        )}
      </View>

      <View style={styles.block}>
        <Text style={styles.title}>行程信息</Text>
        <Text style={styles.rowText}>起点：{order.pickup_address}</Text>
        <Text style={styles.rowText}>终点：{order.dropoff_address}</Text>
        <Text style={styles.rowText}>
          预估距离：{order.estimated_distance_km ?? '-'} km
        </Text>
        <Text style={styles.rowText}>
          预估费用：¥{order.estimated_price.toFixed(2)}
        </Text>
        {order.final_price != null && (
          <Text style={styles.rowText}>结算金额：¥{order.final_price.toFixed(2)}</Text>
        )}
        <Text style={styles.rowText}>司机：{order.driver_id ?? '待分配'}</Text>
      </View>

      {actions.length > 0 && (
        <View style={styles.block}>
          <Text style={styles.title}>操作</Text>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.status}
              style={[
                styles.actionBtn,
                action.status === 'canceled'
                  ? { backgroundColor: '#f3f4f6', borderColor: '#fca5a5', borderWidth: 1 }
                  : {},
              ]}
              onPress={() => handleUpdate(action.status)}
            >
              <Text
                style={[
                  styles.actionText,
                  action.status === 'canceled' ? { color: '#b91c1c' } : {},
                ]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  block: {
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
  title: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  statusText: { fontSize: 20, fontWeight: '700' },
  rowText: { marginTop: 4, color: '#111827' },
  meta: { marginTop: 4, color: '#6b7280', fontSize: 12 },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#111827',
    borderRadius: 10,
    marginTop: 10,
  },
  actionText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
