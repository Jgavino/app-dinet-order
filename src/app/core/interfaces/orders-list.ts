import { Customer } from './customer';
import { Product } from './product';

export interface OrdersList {
  id: string;
  orderNumber: string;
  customer: Customer;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  billingAddress: string;
  items: ItemList[];
  shippingMethod: string;
  deliveryDate: string;
  shippingDate: string;
  discount: number;
  taxAmount: number;
}

export interface ItemList {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  product: Product;
}
