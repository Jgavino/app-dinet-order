export interface OrderCreate {
  orderNumber: string;
  customerId: string;
  totalAmount: number;
  shippingAddress: string;
  billingAddress: string;
  items: Item[];
  shippingMethod: string;
  discount: number;
  taxAmount: number;
}

export interface OrderUpdate {
  id: string;
  status: string;
  shippingAddress: string;
  billingAddress: string;
  items: Item[];
  shippingMethod: string;
  discount: number;
  taxAmount: number;
  totalAmount: number;
}

export interface Item {
  id: string;
  productId: string;
  quantity: number;
}
