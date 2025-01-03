import type {
  Hero,
  User,
  Cart,
  Order,
  Address,
  Product,
  Provider,
  CartItem,
  Promotion,
  CustomList,
  Collection,
  ProductFile,
  DiscountCode,
  PaymentMethod,
  ProductReview,
  ProductHistory,
  ProductOnOrder,
  StockReservation,
  CustomProductList,
  ProductOnCollection,
  InventoryTransaction,
} from "@prisma/client";

export interface ICartItem extends CartItem {
  cart: ICart;
  product: IProduct;
}

export interface ICart extends Cart {
  user: IUser;
  items: ICartItem[];
}

export interface IUser extends User {
  cart?: ICart;
  orders: IOrder[];
  addresses: IAddress[];
  reviews: IProductReview[];
  customLists: ICustomList[];
  paymentMethods: IPaymentMethod[];
  stockReservations: IStockReservation[];
}

export interface ICustomList extends CustomList {
  user: IUser;
  products: ICustomProductList[];
}

export interface ICustomProductList extends CustomProductList {
  product: IProduct;
  customList: ICustomList;
}

export interface IProvider extends Provider {
  _count?: object;
  products: IProduct[];
}

export interface IProduct extends Product {
  _count?: object;
  provider: IProvider;
  files: IProductFile[];
  cartItems: ICartItem[];
  reviews: IProductReview[];
  orders: IProductOnOrder[];
  history: IProductHistory[];
  collections: ICollection[];
  transactions: IInventoryTransaction[];
  stockReservations: IStockReservation[];
  customProductsList: ICustomProductList[];
}

export interface IProductHistory extends ProductHistory {
  product: IProduct;
}

export interface IProductOnCollection extends ProductOnCollection {
  product: IProduct;
  collection: ICollection;
}

export interface ICollection extends Collection {
  hero?: IHero;
  products: IProductOnCollection[];
}

export interface IProductFile extends ProductFile {
  product: IProduct;
}

export interface IProductReview extends ProductReview {
  user: IUser;
  product: IProduct;
}

export interface IProductOnOrder extends ProductOnOrder {
  order: IOrder;
  product: IProduct;
}

export interface IStockReservation extends StockReservation {
  user: IUser;
  product: IProduct;
}

export interface IOrder extends Order {
  user?: IUser;
  address?: IAddress;
  promotion?: IPromotion;
  payment?: IPaymentMethod;
  products: IProductOnOrder[];
  discountCode?: IDiscountCode;
}

export interface IInventoryTransaction extends InventoryTransaction {
  product: IProduct;
}

export interface IPromotion extends Promotion {
  orders: IOrder[];
  discountCodes: IDiscountCode[];
}

export interface IDiscountCode extends DiscountCode {
  orders: IOrder[];
  promotion: IPromotion;
}

export interface IPaymentMethod extends PaymentMethod {
  user: IUser;
  orders: IOrder[];
}

export interface IAddress extends Address {
  user: IUser;
  orders: IOrder[];
}

export interface IHero extends Hero {
  collection: ICollection;
}

// END OF MODELS FROM PRISMA
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
    lastName?: string;
    firstName?: string;
    wantsNewsletter?: string;
  };
}

export interface IRecoverPasswordState extends ISharedState {
  errors?: {
    email?: string;
  };
}

export interface IResetPasswordState extends ISharedState {
  errors?: {
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

export interface IHeroState extends ISharedState {
  errors?: {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    description?: string;
    collectionId?: string;
  };
}

export interface ICollectionState extends ISharedState {
  errors?: {
    name?: string;
    link?: string;
    imageUrl?: string;
  };
}

export interface IAddNDeleteProductToFromCollectionState extends ISharedState {}

export interface IGenericIcon {
  size?: string;
  customClass?: string;
  strokeWidth?: number;
  isFilled?: boolean;
}

export interface IBaseLangPage {
  // React 19
  // params: Promise<{
  //   lng: string;
  // }>;

  params: {
    lng: string;
  };
}

export interface IProductSearchParams {
  q?: string;
  id?: string;
  key?: string;
  page?: number;
  limit?: number;
  orderBy?: object;
  allData?: boolean;
  provider?: string;
  category?: string;
  collection?: string;
  salePriceMXNTo?: number | string;
  isAdminRequest?: boolean;
  salePriceMXNFrom?: number | string;
  availableQuantityTo?: number | string;
  availableQuantityFrom?: number | string;
}

export interface IUserSearchParams {
  q?: string;
  id?: string;
  email?: string;
  orderBy?: object;
  allData?: boolean;
  username?: string;
  isAdminRequest?: boolean;
  wantsNewsletter?: boolean | string;
  resetPasswordToken?: string;
}

export interface ICollectionSearchParams {
  q?: string;
  id?: string;
  name?: string;
  link?: string;
  orderBy?: object;
  allData?: boolean;
  isAdminRequest?: boolean;
}

export interface ICartItemForFrontend {
  id: string;
  name: string;
  file: string;
  price: number;
  quantity: number;
}
