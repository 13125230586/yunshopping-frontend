export interface User {
  id: number
  userAccount: string
  userName: string
  userAvatar: string
  userProfile: string
  userRole: 'buyer' | 'seller' | 'admin'
  phone: string
  email: string
  gender: 0 | 1 | 2
  birthday: string
  defaultAddressId: number
  createTime: string
}

export interface Address {
  id: number
  userId: number
  receiverName: string
  receiverPhone: string
  province: string
  city: string
  district: string
  detailAddress: string
  postalCode: string
  isDefault: 0 | 1
}

export interface Category {
  id: number
  categoryName: string
  parentId: number
  level: 1 | 2 | 3
  sortOrder: number
  icon: string
  children?: Category[]
}

export interface Product {
  id: number
  productName: string
  productTitle: string
  productDescription: string
  categoryId: number
  shopId: number
  shopName: string
  brandName: string
  mainImageUrl: string
  imageUrls: string
  price: number
  originalPrice: number
  stock: number
  sales: number
  unit: string
  weight: number
  tags: string
  specifications: string
  status: 0 | 1 | 2
  reviewStatus: 0 | 1 | 2
  viewCount: number
  favoriteCount: number
  createTime: string
}

export interface CartItem {
  id: number
  productId: number
  productName: string
  productImage: string
  price: number
  quantity: number
  specification: string
  isChecked: 0 | 1
  stock: number
  shopId: number
  shopName: string
}

export interface Shop {
  id: number
  shopName: string
  shopLogo: string
  shopBanner: string
  shopDescription: string
  shopLevel: 0 | 1 | 2
  shopStatus: 0 | 1 | 2 | 3
  userId: number
  totalSales: number
  totalRevenue: number
  rating: number
  reviewCount: number
  province: string
  city: string
  createTime: string
}

export interface OrderItem {
  id: number
  productId: number
  productName: string
  productImage: string
  price: number
  quantity: number
  totalAmount: number
  specification: string
}

export interface Order {
  id: number
  orderNo: string
  shopId: number
  shopName: string
  totalAmount: number
  payAmount: number
  discountAmount: number
  shippingFee: number
  paymentMethod: string
  orderStatus: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  paymentStatus: 0 | 1 | 2
  shippingStatus: 0 | 1 | 2
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  buyerMessage: string
  payTime: string
  shipTime: string
  completeTime: string
  createTime: string
  orderItems: OrderItem[]
}

export interface Payment {
  id: number
  paymentNo: string
  orderId: number
  paymentMethod: string
  payAmount: number
  payStatus: 0 | 1 | 2
  transactionId: string
  payTime: string
  createTime: string
}

export interface Review {
  id: number
  userId: number
  userName: string
  userAvatar: string
  productId: number
  rating: 1 | 2 | 3 | 4 | 5
  content: string
  images: string
  isAnonymous: 0 | 1
  likeCount: number
  replyContent: string
  replyTime: string
  createTime: string
}

export interface UploadPictureResult {
  picName: string
  picWidth: number
  picHeight: number
  picScale: number
  picFormat: string
  picSize: number
  picColor: string
  url: string
  thumbnailUrl: string
}

export interface Banner {
  id: number
  title: string
  imageUrl: string
  linkType: 'category' | 'product' | 'shop' | 'url'
  linkValue: string
  sortOrder: number
  status: 0 | 1
  createTime: string
}