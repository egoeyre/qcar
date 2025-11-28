// src/services/orderService.ts
import { PostgrestError } from '@supabase/supabase-js';
import {
  CreateOrderPayload,
  OrderFilters,
  RideOrder,
  RideStatus,
} from '../types/models';
import { supabase } from './supabaseClient';

type SingleResult<T> = { data: T | null; error: PostgrestError | null };
type ListResult<T> = { data: T[] | null; error: PostgrestError | null };

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<SingleResult<RideOrder>> => {
  const { data, error } = await supabase
    .from('ride_orders')
    .insert({
      passenger_id: payload.passengerId,
      driver_id: payload.driverId ?? null,
      pickup_address: payload.pickupAddress,
      dropoff_address: payload.dropoffAddress,
      estimated_distance_km: payload.estimatedDistanceKm ?? null,
      estimated_price: payload.estimatedPrice,
      scheduled_at: payload.scheduledAt ?? null,
      status: 'pending',
    })
    .select('*')
    .single();

  return { data: (data as RideOrder | null) ?? null, error };
};

export const fetchUserOrders = async (
  userId: string,
  filters: OrderFilters = {}
): Promise<ListResult<RideOrder>> => {
  const role = filters.role ?? 'passenger';

  let query = supabase
    .from('ride_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (role === 'driver') {
    query = query.eq('driver_id', userId);
  } else {
    query = query.eq('passenger_id', userId);
  }

  if (filters.status && filters.status.length > 0) {
    query = query.in('status', filters.status);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  return { data: (data as RideOrder[] | null) ?? null, error };
};

export const fetchOrderById = async (
  orderId: string
): Promise<SingleResult<RideOrder>> => {
  const { data, error } = await supabase
    .from('ride_orders')
    .select('*')
    .eq('id', orderId)
    .single();

  return { data: (data as RideOrder | null) ?? null, error };
};

export const acceptOrder = async (
  orderId: string,
  driverId: string
): Promise<SingleResult<RideOrder>> => {
  const { data, error } = await supabase
    .from('ride_orders')
    .update({
      driver_id: driverId,
      status: 'accepted',
    })
    .eq('id', orderId)
    .select('*')
    .single();

  return { data: (data as RideOrder | null) ?? null, error };
};

interface UpdateOrderStatusPayload {
  status: RideStatus;
  startedAt?: string;
  completedAt?: string;
  finalPrice?: number;
  driverId?: string | null;
}

export const updateOrderStatus = async (
  orderId: string,
  payload: UpdateOrderStatusPayload
): Promise<SingleResult<RideOrder>> => {
  const { data, error } = await supabase
    .from('ride_orders')
    .update({
      status: payload.status,
      started_at: payload.startedAt ?? undefined,
      completed_at: payload.completedAt ?? undefined,
      final_price: payload.finalPrice ?? undefined,
      driver_id: payload.driverId ?? undefined,
    })
    .eq('id', orderId)
    .select('*')
    .single();

  return { data: (data as RideOrder | null) ?? null, error };
};

export const cancelOrder = async (
  orderId: string
): Promise<SingleResult<RideOrder>> =>
  updateOrderStatus(orderId, { status: 'canceled' });

/**
 * 示例：
 * await createOrder({ passengerId, pickupAddress: 'A', dropoffAddress: 'B', estimatedPrice: 35 })
 * const { data: orders } = await fetchUserOrders(passengerId, { status: ['pending'] })
 */
