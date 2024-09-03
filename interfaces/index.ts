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
  alias: string;
  products: IProduct[];
  _count: {
    products: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  id: string;
  name: string;
  key: string;
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
  _count: {
    orders: number;
  };
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
    alias?: string;
  };
}

export interface ICreateNUpdateProductState extends ISharedState {
  errors?: {
    dollarExchangeRate?: string;
    name?: string;
    key?: string;
    quantityPerCarton?: string;
    chinesePriceUSD?: string;
    shippingCostMXN?: string;
    salePriceMXN?: string;
    orderDate?: string;
    providerId?: string;
  };
}

export interface ICreateOrder extends ISharedState {
  errors?: {
    order?: {
      client?: string;
      shipmentType?: string;
    };
    products?: {
      productKey?: string;
      quantity?: string;
    }[];
  };
}
