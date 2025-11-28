// src/services/paymentService.ts
import { PostgrestError } from '@supabase/supabase-js';
import { Payment, PaymentStatus } from '../types/models';
import { supabase } from './supabaseClient';

type SingleResult<T> = { data: T | null; error: PostgrestError | null };
type ListResult<T> = { data: T[] | null; error: PostgrestError | null };

export const createPaymentRecord = async (
  orderId: string,
  amount: number
): Promise<SingleResult<Payment>> => {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      order_id: orderId,
      amount,
      status: 'pending',
    })
    .select('*')
    .single();

  return { data: (data as Payment | null) ?? null, error };
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: PaymentStatus
): Promise<SingleResult<Payment>> => {
  const { data, error } = await supabase
    .from('payments')
    .update({
      status,
      paid_at: status === 'paid' ? new Date().toISOString() : null,
    })
    .eq('id', paymentId)
    .select('*')
    .single();

  return { data: (data as Payment | null) ?? null, error };
};

export const fetchPaymentsByOrder = async (
  orderId: string
): Promise<ListResult<Payment>> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });

  return { data: (data as Payment[] | null) ?? null, error };
};

/**
 * 示例：
 * const { data: payment } = await createPaymentRecord(orderId, 50)
 * await updatePaymentStatus(payment!.id, 'paid')
 */
