declare namespace API {
  type Address = {
    city?: string
    createTime?: string
    detailAddress?: string
    district?: string
    id?: number
    isDefault?: number
    isDelete?: number
    postalCode?: string
    province?: string
    receiverName?: string
    receiverPhone?: string
    updateTime?: string
    userId?: number
  }

  type AddressVO = {
    city?: string
    detailAddress?: string
    district?: string
    id?: number
    isDefault?: number
    postalCode?: string
    province?: string
    receiverName?: string
    receiverPhone?: string
  }

  type AdminStatisticsVO = {
    pendingProducts?: number
    pendingShops?: number
    totalOrders?: number
    totalUsers?: number
  }

  type BannerAddRequest = {
    imageUrl?: string
    linkType?: string
    linkValue?: string
    sortOrder?: number
    status?: number
    title?: string
  }

  type BannerQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    status?: number
    title?: string
  }

  type BannerSortItem = {
    id?: number
    sortOrder?: number
  }

  type BannerSortRequest = {
    banners?: BannerSortItem[]
  }

  type BannerStatusRequest = {
    id?: number
    status?: number
  }

  type BannerUpdateRequest = {
    id?: number
    imageUrl?: string
    linkType?: string
    linkValue?: string
    sortOrder?: number
    status?: number
    title?: string
  }

  type BannerVO = {
    createTime?: string
    id?: number
    imageUrl?: string
    linkType?: string
    linkValue?: string
    sortOrder?: number
    status?: number
    title?: string
    updateTime?: string
  }

  type BaseResponseAdminStatisticsVO_ = {
    code?: number
    data?: AdminStatisticsVO
    message?: string
  }

  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseListAddressVO_ = {
    code?: number
    data?: AddressVO[]
    message?: string
  }

  type BaseResponseListBannerVO_ = {
    code?: number
    data?: BannerVO[]
    message?: string
  }

  type BaseResponseListCartVO_ = {
    code?: number
    data?: CartVO[]
    message?: string
  }

  type BaseResponseListCategoryVO_ = {
    code?: number
    data?: CategoryVO[]
    message?: string
  }

  type BaseResponseListDistributionDataVO_ = {
    code?: number
    data?: DistributionDataVO[]
    message?: string
  }

  type BaseResponseListTrendDataVO_ = {
    code?: number
    data?: TrendDataVO[]
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponseOrderVO_ = {
    code?: number
    data?: OrderVO
    message?: string
  }

  type BaseResponsePageBannerVO_ = {
    code?: number
    data?: PageBannerVO_
    message?: string
  }

  type BaseResponsePageOrderVO_ = {
    code?: number
    data?: PageOrderVO_
    message?: string
  }

  type BaseResponsePageProductVO_ = {
    code?: number
    data?: PageProductVO_
    message?: string
  }

  type BaseResponsePageReviewVO_ = {
    code?: number
    data?: PageReviewVO_
    message?: string
  }

  type BaseResponsePageShopVO_ = {
    code?: number
    data?: PageShopVO_
    message?: string
  }

  type BaseResponsePageUserVO_ = {
    code?: number
    data?: PageUserVO_
    message?: string
  }

  type BaseResponsePaymentVO_ = {
    code?: number
    data?: PaymentVO
    message?: string
  }

  type BaseResponseProductVO_ = {
    code?: number
    data?: ProductVO
    message?: string
  }

  type BaseResponseShopVO_ = {
    code?: number
    data?: ShopVO
    message?: string
  }

  type BaseResponseString_ = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseUploadPictureResult_ = {
    code?: number
    data?: UploadPictureResult
    message?: string
  }

  type BaseResponseUser_ = {
    code?: number
    data?: User
    message?: string
  }

  type cancelOrderUsingPOSTParams = {
    /** orderId */
    orderId: number
  }

  type CartAddRequest = {
    productId?: number
    quantity?: number
    specification?: string
  }

  type CartVO = {
    id?: number
    isChecked?: number
    price?: number
    productId?: number
    productImage?: string
    productName?: string
    quantity?: number
    shopId?: number
    shopName?: string
    specification?: string
    stock?: number
  }

  type Category = {
    categoryName?: string
    createTime?: string
    icon?: string
    id?: number
    isDelete?: number
    level?: number
    parentId?: number
    sortOrder?: number
    updateTime?: string
  }

  type CategoryVO = {
    categoryName?: string
    children?: CategoryVO[]
    icon?: string
    id?: number
    level?: number
    parentId?: number
    sortOrder?: number
  }

  type confirmReceiptUsingPOSTParams = {
    /** orderId */
    orderId: number
  }

  type createPaymentUsingPOSTParams = {
    /** orderId */
    orderId: number
    /** paymentMethod */
    paymentMethod: number
  }

  type deleteFileByUrlUsingPOSTParams = {
    /** fileUrl */
    fileUrl: string
  }

  type deleteOrderUsingPOSTParams = {
    /** orderId */
    orderId: number
  }

  type DeleteRequest = {
    id?: number
  }

  type DistributionDataVO = {
    count?: number
    name?: string
    status?: number
  }

  type getOrderDetailUsingGETParams = {
    /** orderId */
    orderId: number
  }

  type getOrderTrendUsingGETParams = {
    /** days */
    days?: number
  }

  type getPaymentByOrderIdUsingGETParams = {
    /** orderId */
    orderId: number
  }

  type getProductByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getSalesTrendUsingGETParams = {
    /** days */
    days?: number
  }

  type getShopByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type listReviewByPageUsingGETParams = {
    /** current */
    current?: number
    /** pageSize */
    pageSize?: number
    /** productId */
    productId: number
  }

  type OrderCreateRequest = {
    addressId?: number
    buyerMessage?: string
    cartIds?: number[]
    couponId?: number
    shopId?: number
  }

  type OrderItemVO = {
    id?: number
    price?: number
    productId?: number
    productImage?: string
    productName?: string
    quantity?: number
    specification?: string
    totalAmount?: number
  }

  type OrderQueryRequest = {
    current?: number
    id?: number
    orderNo?: string
    orderStatus?: number
    pageSize?: number
    paymentStatus?: number
    shopId?: number
    sortField?: string
    sortOrder?: string
    userId?: number
  }

  type OrderVO = {
    buyerMessage?: string
    completeTime?: string
    createTime?: string
    discountAmount?: number
    id?: number
    orderItems?: OrderItemVO[]
    orderNo?: string
    orderStatus?: number
    payAmount?: number
    payTime?: string
    paymentMethod?: string
    paymentStatus?: number
    receiverAddress?: string
    receiverName?: string
    receiverPhone?: string
    shipTime?: string
    shippingFee?: number
    shippingStatus?: number
    shopId?: number
    shopName?: string
    totalAmount?: number
  }

  type PageBannerVO_ = {
    current?: number
    pages?: number
    records?: BannerVO[]
    size?: number
    total?: number
  }

  type PageOrderVO_ = {
    current?: number
    pages?: number
    records?: OrderVO[]
    size?: number
    total?: number
  }

  type PageProductVO_ = {
    current?: number
    pages?: number
    records?: ProductVO[]
    size?: number
    total?: number
  }

  type PageReviewVO_ = {
    current?: number
    pages?: number
    records?: ReviewVO[]
    size?: number
    total?: number
  }

  type PageShopVO_ = {
    current?: number
    pages?: number
    records?: ShopVO[]
    size?: number
    total?: number
  }

  type PageUserVO_ = {
    current?: number
    pages?: number
    records?: UserVO[]
    size?: number
    total?: number
  }

  type paymentCallbackUsingPOSTParams = {
    /** paymentNo */
    paymentNo: string
    /** tradeNo */
    tradeNo: string
  }

  type paymentFailedUsingPOSTParams = {
    /** paymentNo */
    paymentNo: string
  }

  type PaymentVO = {
    createTime?: string
    id?: number
    orderId?: number
    payAmount?: number
    payStatus?: number
    payTime?: string
    paymentMethod?: string
    paymentNo?: string
    transactionId?: string
  }

  type ProductAddRequest = {
    brandName?: string
    categoryId?: number
    imageUrls?: string
    mainImageUrl?: string
    originalPrice?: number
    price?: number
    productDescription?: string
    productName?: string
    productTitle?: string
    shopId?: number
    specifications?: string
    stock?: number
    tags?: string
    unit?: string
    weight?: number
  }

  type ProductQueryRequest = {
    brandName?: string
    categoryId?: number
    current?: number
    id?: number
    maxPrice?: number
    minPrice?: number
    pageSize?: number
    productName?: string
    reviewStatus?: number
    searchText?: string
    shopId?: number
    sortField?: string
    sortOrder?: string
    status?: number
  }

  type ProductReviewRequest = {
    id?: number
    reviewMessage?: string
    reviewStatus?: number
  }

  type ProductStatusRequest = {
    id?: number
    status?: number
  }

  type ProductUpdateRequest = {
    brandName?: string
    categoryId?: number
    id?: number
    imageUrls?: string
    mainImageUrl?: string
    originalPrice?: number
    price?: number
    productDescription?: string
    productName?: string
    productTitle?: string
    specifications?: string
    stock?: number
    tags?: string
    unit?: string
    weight?: number
  }

  type ProductVO = {
    brandName?: string
    categoryId?: number
    createTime?: string
    favoriteCount?: number
    id?: number
    imageUrls?: string
    mainImageUrl?: string
    originalPrice?: number
    price?: number
    productDescription?: string
    productName?: string
    productTitle?: string
    reviewStatus?: number
    sales?: number
    shopId?: number
    shopName?: string
    specifications?: string
    status?: number
    stock?: number
    tags?: string
    unit?: string
    viewCount?: number
    weight?: number
  }

  type Review = {
    content?: string
    createTime?: string
    id?: number
    images?: string
    isAnonymous?: number
    isDelete?: number
    likeCount?: number
    orderId?: number
    productId?: number
    rating?: number
    replyContent?: string
    replyTime?: string
    shopId?: number
    updateTime?: string
    userId?: number
  }

  type ReviewVO = {
    content?: string
    createTime?: string
    id?: number
    images?: string
    isAnonymous?: number
    likeCount?: number
    productId?: number
    rating?: number
    replyContent?: string
    replyTime?: string
    userAvatar?: string
    userId?: number
    userName?: string
  }

  type setDefaultAddressUsingPOSTParams = {
    /** addressId */
    addressId: number
  }

  type ShopAddRequest = {
    city?: string
    province?: string
    shopBanner?: string
    shopDescription?: string
    shopLevel?: number
    shopLogo?: string
    shopName?: string
  }

  type ShopQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    reviewStatus?: number
    shopLevel?: number
    shopName?: string
    shopStatus?: number
    sortField?: string
    sortOrder?: string
    userId?: number
  }

  type ShopReviewRequest = {
    id?: number
    reviewMessage?: string
    reviewStatus?: number
  }

  type ShopStatusRequest = {
    id?: number
    shopStatus?: number
  }

  type ShopUpdateRequest = {
    city?: string
    id?: number
    province?: string
    shopBanner?: string
    shopDescription?: string
    shopLevel?: number
    shopLogo?: string
    shopName?: string
  }

  type ShopVO = {
    city?: string
    createTime?: string
    id?: number
    province?: string
    rating?: number
    reviewCount?: number
    shopBanner?: string
    shopDescription?: string
    shopLevel?: number
    shopLogo?: string
    shopName?: string
    shopStatus?: number
    totalRevenue?: number
    totalSales?: number
    userId?: number
  }

  type TrendDataVO = {
    amount?: number
    count?: number
    date?: string
  }

  type updateQuantityUsingPOSTParams = {
    /** cartId */
    cartId: number
    /** quantity */
    quantity: number
  }

  type UploadPictureResult = {
    picColor?: string
    picFormat?: string
    picHeight?: number
    picName?: string
    picScale?: number
    picSize?: number
    picWidth?: number
    thumbnailUrl?: string
    url?: string
  }

  type User = {
    birthday?: string
    createTime?: string
    defaultAddressId?: number
    editTime?: string
    email?: string
    gender?: number
    id?: number
    isDelete?: number
    phone?: string
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
  }

  type userLoginUsingPOSTParams = {
    /** userAccount */
    userAccount?: string
    /** userPassword */
    userPassword?: string
  }

  type UserPasswordUpdateRequest = {
    checkPassword?: string
    newPassword?: string
    oldPassword?: string
  }

  type UserProfileUpdateRequest = {
    userAvatar?: string
    userName?: string
    userProfile?: string
  }

  type UserQueryRequest = {
    current?: number
    pageSize?: number
    phone?: string
    sortField?: string
    sortOrder?: string
    userAccount?: string
    userName?: string
    userRole?: string
  }

  type userRegisterUsingPOSTParams = {
    /** checkPassword */
    checkPassword?: string
    /** userAccount */
    userAccount?: string
    /** userPassword */
    userPassword?: string
  }

  type UserUpdateRequest = {
    email?: string
    id?: number
    phone?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserVO = {
    birthday?: string
    createTime?: string
    email?: string
    gender?: number
    id?: number
    phone?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
