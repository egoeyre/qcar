// src/context/OrdersContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RideOrder, RideStatus } from '../types/models';

const STORAGE_KEY = '@qcar_orders_v1';

interface CreateOrderInput {
  passengerId: string;
  pickupAddress: string;
  dropoffAddress: string;
  estimatedDistanceKm: number;
  estimatedPrice: number;
}

interface OrdersContextValue {
  orders: RideOrder[];
  loading: boolean;
  createOrder: (input: CreateOrderInput) => Promise<RideOrder>;
  refreshOrders: () => Promise<void>;
  getOrderById: (orderId: string) => RideOrder | undefined;
  updateOrderStatus: (
    orderId: string,
    status: RideStatus,
    options?: { finalPrice?: number; driverId?: string | null }
  ) => Promise<RideOrder | null>;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<RideOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const persist = async (next: RideOrder[]) => {
    setOrders(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const refreshOrders = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setOrders([]);
      } else {
        setOrders(JSON.parse(raw));
      }
    } catch (e) {
      console.warn('加载本地订单失败', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  const createOrder = useCallback(
    async (input: CreateOrderInput): Promise<RideOrder> => {
      const now = new Date().toISOString();
      const newOrder: RideOrder = {
        id: `local-${Date.now()}`,
        passenger_id: input.passengerId,
        driver_id: null,
        pickup_address: input.pickupAddress,
        dropoff_address: input.dropoffAddress,
        estimated_distance_km: input.estimatedDistanceKm,
        estimated_price: input.estimatedPrice,
        final_price: null,
        status: 'pending',
        created_at: now,
        updated_at: now,
        scheduled_at: null,
        started_at: null,
        completed_at: null,
      };

      const next = [newOrder, ...orders];
      await persist(next);
      return newOrder;
    },
    [orders]
  );

  const updateOrderStatus = useCallback(
    async (
      orderId: string,
      status: RideStatus,
      options?: { finalPrice?: number; driverId?: string | null }
    ): Promise<RideOrder | null> => {
      const now = new Date().toISOString();
      let updated: RideOrder | null = null;

      const next = orders.map((order) => {
        if (order.id !== orderId) return order;

        const patch: Partial<RideOrder> = {
          status,
          updated_at: now,
        };

        if (status === 'in_progress' && !order.started_at) {
          patch.started_at = now;
        }

        if (status === 'completed' && !order.completed_at) {
          patch.completed_at = now;
          patch.final_price = options?.finalPrice ?? order.estimated_price;
        }

        if (options?.driverId !== undefined) {
          patch.driver_id = options.driverId;
        }

        updated = { ...order, ...patch };
        return updated;
      });

      await persist(next);
      return updated;
    },
    [orders]
  );

  const getOrderById = useCallback(
    (orderId: string) => orders.find((o) => o.id === orderId),
    [orders]
  );

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders,
      loading,
      createOrder,
      refreshOrders,
      getOrderById,
      updateOrderStatus,
    }),
    [orders, loading, createOrder, refreshOrders, getOrderById, updateOrderStatus]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
};
