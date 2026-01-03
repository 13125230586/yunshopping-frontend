export const ErrorCode = {
  SUCCESS: 0,
  PARAMS_ERROR: 40000,
  NOT_LOGIN_ERROR: 40100,
  NO_AUTH_ERROR: 40101,
  NOT_FOUND_ERROR: 40400,
  FORBIDDEN_ERROR: 40300,
  SYSTEM_ERROR: 50000,
  OPERATION_ERROR: 50001,
}

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

export enum Gender {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

export enum ShopLevel {
  NORMAL = 0,
  BRAND = 1,
  FLAGSHIP = 2,
}

export const ShopLevelText = {
  [ShopLevel.NORMAL]: '普通店',
  [ShopLevel.BRAND]: '品牌店',
  [ShopLevel.FLAGSHIP]: '旗舰店',
}

export enum ShopStatus {
  PENDING = 0,
  OPEN = 1,
  CLOSED = 2,
  REJECTED = 3,
}

export const ShopStatusText = {
  [ShopStatus.PENDING]: '待审核',
  [ShopStatus.OPEN]: '营业中',
  [ShopStatus.CLOSED]: '已关闭',
  [ShopStatus.REJECTED]: '审核拒绝',
}

export enum ProductStatus {
  PENDING = 0,
  ON_SALE = 1,
  OFF_SALE = 2,
}

export const ProductStatusText = {
  [ProductStatus.PENDING]: '待上架',
  [ProductStatus.ON_SALE]: '已上架',
  [ProductStatus.OFF_SALE]: '已下架',
}

export enum ReviewStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export const ReviewStatusText = {
  [ReviewStatus.PENDING]: '待审核',
  [ReviewStatus.APPROVED]: '审核通过',
  [ReviewStatus.REJECTED]: '审核拒绝',
}

export enum OrderStatus {
  UNPAID = 0,
  PAID = 1,
  PENDING_SHIP = 2,
  SHIPPED = 3,
  COMPLETED = 4,
  CANCELLED = 5,
  REFUNDING = 6,
  REFUNDED = 7,
}

export const OrderStatusText = {
  [OrderStatus.UNPAID]: '待支付',
  [OrderStatus.PAID]: '已支付',
  [OrderStatus.PENDING_SHIP]: '待发货',
  [OrderStatus.SHIPPED]: '已发货',
  [OrderStatus.COMPLETED]: '已完成',
  [OrderStatus.CANCELLED]: '已取消',
  [OrderStatus.REFUNDING]: '退款中',
  [OrderStatus.REFUNDED]: '已退款',
}

export enum PaymentStatus {
  UNPAID = 0,
  PAID = 1,
  REFUNDED = 2,
}

export const PaymentStatusText = {
  [PaymentStatus.UNPAID]: '未支付',
  [PaymentStatus.PAID]: '已支付',
  [PaymentStatus.REFUNDED]: '已退款',
}

export enum ShippingStatus {
  NOT_SHIPPED = 0,
  SHIPPED = 1,
  RECEIVED = 2,
}

export const ShippingStatusText = {
  [ShippingStatus.NOT_SHIPPED]: '未发货',
  [ShippingStatus.SHIPPED]: '已发货',
  [ShippingStatus.RECEIVED]: '已签收',
}

export enum PaymentMethod {
  ALIPAY = 1,
  WXPAY = 2,
}

export const PaymentMethodText = {
  [PaymentMethod.ALIPAY]: '支付宝',
  [PaymentMethod.WXPAY]: '微信支付',
}

export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_CURRENT = 1

export const IMAGE_ACCEPT = 'image/jpeg,image/jpg,image/png,image/webp'
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024