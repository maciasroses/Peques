export interface IUser {
  id: string;
  email: string;
  password: string;
  username: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}

export interface IProvider {
  id: string;
  name: string;
  products: IProduct[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  id: string;
  name: string;
  quantityPerCarton: number;
  chinesePriceUSD: number;
  pricePerCartonOrProductUSD: number;
  costMXN: number;
  shippingCostMXN: number;
  totalCostMXN: number;
  salePriceMXN: number;
  margin: number;
  salePerQuantity: number;
  orderDate: Date;
  provider: IProvider;
  orders: IOrder[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  id: string;
  client: string;
  discount?: number;
  total: number;
  shipmentType: string;
  isPaid: boolean;
  deliveryStatus: "PENDING" | "CANCELLED" | "DELIVERED";
  pendingPayment?: number;
  products: IProduct[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISharedState {
  message?: string;
  success: boolean;
}

export interface ILoginState extends ISharedState {
  errors?: {
    email?: string;
    password?: string;
  };
}

export interface IRegisterState extends ISharedState {
  errors?: {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
}

export interface ICreateNUpdateProviderState extends ISharedState {
  errors?: {
    name?: string;
  };
}
