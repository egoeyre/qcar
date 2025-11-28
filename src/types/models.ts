// src/types/models.ts
export type UserRole = 'passenger' | 'driver' | 'admin';

export type DriverStatus = 'pending' | 'approved' | 'rejected';

export type RideStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'canceled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface UserProfile {
  id: string;
  role: UserRole;
  phone?: string | null;
  name?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DriverProfile {
  id: string;
  user_id: string;
  license_number: string;
  license_photo_url?: string | null;
  car_model?: string | null;
  car_plate_number?: string | null;
  status: DriverStatus;
  created_at: string;
  updated_at: string;
}

export interface RideOrder {
  id: string;
  passenger_id: string;
  driver_id?: string | null;
  pickup_address: string;
  dropoff_address: string;
  estimated_distance_km?: number | null;
  estimated_price: number;
  final_price?: number | null;
  status: RideStatus;
  scheduled_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  status: PaymentStatus;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderPayload {
  passengerId: string;
  pickupAddress: string;
  dropoffAddress: string;
  estimatedDistanceKm?: number;
  estimatedPrice: number;
  scheduledAt?: string;
  driverId?: string;
}

export interface OrderFilters {
  role?: Extract<UserRole, 'passenger' | 'driver'>;
  status?: RideStatus[];
  limit?: number;
}
