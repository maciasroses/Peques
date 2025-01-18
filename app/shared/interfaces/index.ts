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
  ProductCategory,
  ProductCategoryOnPromotion,
  ProductOnPromotion,
} from "@prisma/client";

// MODELS
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

export interface IProductCategory extends ProductCategory {
  products: IProduct[];
  promotions: IProductCategoryOnPromotion[];
}

export interface IProduct extends Product {
  _count?: object;
  provider: IProvider;
  category?: IProductCategory;
  files: IProductFile[];
  cartItems: ICartItem[];
  reviews: IProductReview[];
  orders: IProductOnOrder[];
  history: IProductHistory[];
  collections: ICollection[];
  promotions: IProductOnPromotion[];
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

export interface IProductCategoryOnPromotion
  extends ProductCategoryOnPromotion {
  promotion: IPromotion;
  productCategory: IProductCategory;
}

export interface IProductOnPromotion extends ProductOnPromotion {
  product: IProduct;
  promotion: IPromotion;
}

export interface IPromotion extends Promotion {
  orders: IOrder[];
  discountCodes: IDiscountCode[];
  products: IProductOnPromotion[];
  categories: IProductCategoryOnPromotion[];
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

// STATES
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

export interface ICreateOrderState extends ISharedState {
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

export interface ICustomListState extends ISharedState {
  errors?: {
    name?: string;
  };
}

export interface IAddProductToCustomList extends ISharedState {
  errors?: {
    productId?: string;
    customListId?: string;
  }[];
}

export interface IUpdateMyMainInfo extends ISharedState {
  errors?: {
    email?: string;
    username?: string;
    lastName?: string;
    firstName?: string;
  };
}

export interface ICustomListState extends ISharedState {
  errors?: {
    name?: string;
  };
}

export interface IAddressState extends ISharedState {
  address?: IAddress;
  errors?: {
    fullName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phoneNumber?: string;
    additionalInfo?: string;
  };
}

// SEARCH PARAMS
export interface IProductSearchParams {
  q?: string;
  id?: string;
  key?: string;
  page?: number | string;
  limit?: number;
  orderBy?: object;
  allData?: boolean;
  provider?: string;
  category?: string;
  collection?: string;
  isForFavorites?: boolean;
  salePriceMXNTo?: number | string;
  isAdminRequest?: boolean;
  takeFromRequest?: number;
  isForBestReviews?: boolean;
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

export interface ICustomListSearchParams {
  id?: string;
  name?: string;
  userId?: string;
  page?: string | number;
  limit?: string | number;
  allData?: boolean;
  isForFav?: boolean;
}

export interface IOrderSearchParams {
  id?: string;
  page?: string | number;
  limit?: string | number;
  userId?: string;
  allData?: boolean;
  isPaid?: boolean;
  client?: string;
  deliveryStatus?: string;
  paymentMethod?: string;
  discountFrom?: string | number;
  discountTo?: string | number;
  subtotalFrom?: string | number;
  subtotalTo?: string | number;
  totalFrom?: string | number;
  totalTo?: string | number;
  isForGraph?: boolean;
  orderBy?: object;
  yearOfData?: string | number;
  isAdminRequest?: boolean;
}

export interface IPaymentMethodSearchParams {
  id?: string;
  userId?: string;
  page?: string | number;
  limit?: string | number;
  allData?: boolean;
  isAdminRequest?: boolean;
  stripePaymentMethodId?: string;
}

export interface IAddressSearchParams {
  id?: string;
  userId?: string;
  page?: string | number;
  limit?: string | number;
  allData?: boolean;
  isAdminRequest?: boolean;
}

// LISTS
export interface IProductList {
  products: IProduct[];
  totalPages: number;
}

export interface IOrderList {
  orders: IOrder[];
  totalPages: number;
}

export interface ICustomListList {
  customLists: ICustomList[];
  totalPages: number;
}

export interface IPaymentMethodList {
  paymentMethods: IPaymentMethod[];
  totalPages: number;
}

export interface IAddressesList {
  addresses: IAddress[];
  totalPages: number;
}

// OTHERS
export type LanguageTypeForSchemas = "en" | "es";

export type CollectionKeys =
  | "game"
  | "complementary_feeding"
  | "blanket_and_quilt";

export interface IBaseLangPage {
  params: {
    lng: string;
  };
}

export interface IGenericIcon {
  size?: string;
  customClass?: string;
  strokeWidth?: number;
  isFilled?: boolean;
}

export interface ICartItemForFrontend {
  id: string;
  name: string;
  file: string;
  price: number;
  quantity: number;
}

export interface IProductFromStripe extends ICartItemForFrontend {}

export interface IBillingDetails {
  address: {
    city: string;
    country: string;
    line1: string;
    line2?: string;
    postal_code: string;
    state: string;
  };
  email: string;
  name: string;
  phone?: string;
}

export interface IProductForEmail {
  name: string;
  file: string;
  price: number;
  quantity: number;
}

export interface IOrderInfoForEmail {
  email: string;
  order: IOrder;
  products: IProductForEmail[];
  totalInCents: number;
}
