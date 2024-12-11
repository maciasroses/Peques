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

export interface IProductHistory {
  id: string;
  quantityPerCarton: number;
  chinesePriceUSD: number;
  dollarExchangeRate: number;
  pricePerCartonOrProductUSD: number;
  costMXN: number;
  shippingCostMXN: number;
  totalCostMXN: number;
  salePriceMXN: number;
  margin: number;
  salePerQuantity: number;
  orderDate: Date;
  product: IProduct;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  id: string;
  name: string;
  key: string;
  minimumAcceptableQuantity: number;
  availableQuantity: number;
  salePriceMXN: number;
  provider: IProvider;
  history: IProductHistory[];
  orders: IOrder[];
  _count: {
    orders: number;
    history: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  id: string;
  orderId?: string;
  quantity?: number;
  client: string;
  discount?: number;
  total: number;
  subtotal: number;
  shipmentType: string;
  paymentMethod: string;
  isPaid: boolean;
  deliveryStatus: "PENDING" | "CANCELLED" | "DELIVERED";
  pendingPayment?: number;
  products: IProduct[];
  productId: string;
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

export interface ICreateNUpdateProductHistoryState extends ISharedState {
  errors?: {
    dollarExchangeRate?: string;
    quantityPerCarton?: string;
    chinesePriceUSD?: string;
    shippingCostMXN?: string;
    salePriceMXN?: string;
    orderDate?: string;
  };
}

export interface ICreateNUpdateProductState extends ISharedState {
  errors?: {
    name?: string;
    key?: string;
    minimumAcceptableQuantity?: string;
    providerId?: string;
    dollarExchangeRate?: string;
    quantityPerCarton?: string;
    chinesePriceUSD?: string;
    shippingCostMXN?: string;
    salePriceMXN?: string;
    orderDate?: string;
  };
}

export interface ICreateOrder extends ISharedState {
  errors?: {
    order?: {
      client?: string;
      shipmentType?: string;
      paymentMethod?: string;
    };
    products?: {
      productKey?: string;
      quantity?: string;
      discount?: string;
    }[];
  };
}

export interface IGenericIcon {
  size?: string;
  customClass?: string;
  strokeWidth?: number;
  isFilled?: boolean;
}

export interface IBaseLangPage {
  params: Promise<{
    lng: string;
  }>;
}
