export type UserRole = 'FARMER' | 'CUSTOMER';

export interface UserProfile {
  id: number;
  name: string;
  username: string;
  role: UserRole;
  contact_number?: string;
  farm_location?: string;
  address?: string;
  created_at?: string;
}

export interface Product {
  product_id: number;
  farmer_id: number;
  product_name: string;
  category: string | null;
  stock_quantity: number;
  unit: string;
  price_per_unit: number | string;
  low_stock_threshold: number | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
  is_low_stock?: boolean;
  total_units_sold?: number;
  total_revenue?: number;
  average_rating?: number;
  reviews_count?: number;
  farmer?: {
    farmer_id: number;
    full_name: string;
    farm_location: string | null;
    contact_number: string | null;
  };
  feedbacks?: Array<{
    rating: number;
    comment: string | null;
    created_at: string;
    customer?: { customer_name: string };
  }>;
}

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type PaymentMethod = 'ONLINE' | 'COD';
export type PaymentStatus = 'PENDING' | 'COMPLETED';
export type TrackingStep = 'PLACED' | 'ACCEPTED' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface OrderExtension {
  ext_id: number;
  order_id: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  delivery_pincode: string | null;
  delivery_fee: number | string;
  delivery_address: string | null;
  tracking_step: TrackingStep;
  estimated_delivery: string | null;
}

export interface OrderFeedback {
  feedback_id: number;
  order_id: number;
  customer_id: number;
  farmer_id: number;
  product_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Order {
  order_id: number;
  customer_id: number;
  farmer_id: number;
  product_id: number;
  quantity: number;
  status: OrderStatus;
  requested_at: string;
  responded_at: string | null;
  product?: Product;
  customer?: {
    customer_id: number;
    customer_name: string;
    contact_number: string | null;
    address: string | null;
  };
  farmer?: {
    farmer_id: number;
    full_name: string;
    farm_location: string | null;
    contact_number: string | null;
  };
  extension?: OrderExtension | null;
  feedback?: OrderFeedback | null;
}

export interface Sale {
  sale_id: number;
  product_id: number;
  customer_id: number;
  farmer_id: number;
  quantity_sold: number;
  total_amount: number | string;
  sale_date: string;
  product?: {
    product_id: number;
    product_name: string;
    category: string | null;
    unit: string;
    price_per_unit: number | string;
  };
  customer?: {
    customer_id: number;
    customer_name: string;
    contact_number: string | null;
    address: string | null;
  };
}

export interface NotificationItem {
  notification_id: number;
  farmer_id: number;
  product_id: number | null;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatMessage {
  message_id: number;
  farmer_id: number;
  customer_id: number;
  sender_role: UserRole;
  message_text: string;
  is_read: boolean;
  created_at: string;
}

export interface MandiBenchmark {
  crop_name: string;
  hindi_name: string;
  category: string;
  unit: string;
  state?: string;
  mandi_name?: string;
  govt_msp: number | null;
  apmc_mandi_price: number;
  farmer_direct_benchmark: number;
  retail_supermarket_price: number;
}

export type ComplaintStatus = 'PENDING' | 'INVESTIGATING' | 'RESOLVED';

export interface Complaint {
  complaint_id: number;
  order_id: number;
  customer_id: number;
  farmer_id: number;
  product_id: number;
  issue_type: string;
  description: string;
  proof_image?: string | null;
  status: ComplaintStatus;
  resolution?: string | null;
  created_at: string;
  customer?: { customer_name: string };
  farmer?: { full_name: string };
  product?: { product_name: string; unit: string };
}

