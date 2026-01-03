<template>
  <div class="product-detail-page">
    <div class="page-container">
      <a-spin :spinning="productStore.loading">
        <a-card v-if="product" class="detail-card">
          <a-row :gutter="24">
            <a-col :span="10">
              <div class="product-images">
                <img :src="currentImage" alt="product" class="main-image" />
                <div class="image-list">
                  <img
                    v-for="(img, index) in imageList"
                    :key="index"
                    :src="img"
                    :class="{ active: currentImage === img }"
                    @click="currentImage = img"
                  />
                </div>
              </div>
            </a-col>
            <a-col :span="14">
              <div class="product-info">
                <h1 class="product-title">{{ product.productTitle || product.productName }}</h1>
                <div class="product-desc">{{ product.productDescription }}</div>
                <div class="product-price">
                  <span class="price">{{ formatPrice(product.price) }}</span>
                  <span v-if="product.originalPrice" class="original-price">
                    {{ formatPrice(product.originalPrice) }}
                  </span>
                </div>
                <a-divider />
                <div class="product-meta">
                  <a-row :gutter="16">
                    <a-col :span="8">
                      <div class="meta-item">
                        <span class="label">销量：</span>
                        <span class="value">{{ product.sales || 0 }}</span>
                      </div>
                    </a-col>
                    <a-col :span="8">
                      <div class="meta-item">
                        <span class="label">库存：</span>
                        <span class="value">{{ product.stock }}</span>
                      </div>
                    </a-col>
                    <a-col :span="8">
                      <div class="meta-item">
                        <span class="label">浏览：</span>
                        <span class="value">{{ product.viewCount || 0 }}</span>
                      </div>
                    </a-col>
                  </a-row>
                </div>
                <a-divider />
                <div class="product-shop">
                  <shop-outlined />
                  <span class="shop-name" @click="handleShopClick">{{ product.shopName }}</span>
                </div>
                <a-divider />
                <div class="product-actions">
                  <a-space>
                    <a-input-number
                      v-model:value="quantity"
                      :min="1"
                      :max="product.stock"
                      size="large"
                    />
                    <a-button type="primary" size="large" @click="handleAddToCart">
                      <shopping-cart-outlined /> 加入购物车
                    </a-button>
                    <a-button size="large" @click="handleBuyNow">立即购买</a-button>
                  </a-space>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ShopOutlined, ShoppingCartOutlined } from '@ant-design/icons-vue'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { formatPrice, parseJSON } from '@/utils'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const userStore = useUserStore()

const quantity = ref(1)
const currentImage = ref('')

const product = computed(() => productStore.productDetail)

const imageList = computed(() => {
  if (!product.value) return []
  const images = [product.value.mainImageUrl]
  if (product.value.imageUrls) {
    const urls = parseJSON<string[]>(product.value.imageUrls, [])
    images.push(...urls)
  }
  return images
})

onMounted(async () => {
  const id = Number(route.params.id)
  await productStore.fetchProductDetail(id)
  if (imageList.value.length > 0) {
    currentImage.value = imageList.value[0]
  }
})

const handleAddToCart = async () => {
  if (!userStore.isLogin) {
    message.warning('请先登录')
    router.push('/login')
    return
  }

  if (!product.value) return

  try {
    await cartStore.addToCart(product.value.id, quantity.value)
    message.success('已加入购物车')
  } catch (error: any) {
    message.error(error.message || '操作失败')
  }
}

const handleBuyNow = async () => {
  if (!userStore.isLogin) {
    message.warning('请先登录')
    router.push('/login')
    return
  }

  await handleAddToCart()
  router.push('/cart')
}

const handleShopClick = () => {
  if (product.value) {
    router.push(`/shop/${product.value.shopId}`)
  }
}
</script>

<style scoped lang="less">
.product-detail-page {
  background: #f5f5f5;
  min-height: calc(100vh - 264px);
  padding: 80px 0;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.product-images {
  .main-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .image-list {
    display: flex;
    gap: 8px;

    img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s;

      &.active,
      &:hover {
        border-color: #1890ff;
      }
    }
  }
}

.product-info {
  .product-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    line-height: 1.5;
    word-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    overflow-wrap: break-word;
    display: block;
    width: 100%;
  }

  .product-desc {
    color: #666;
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .product-price {
    .price {
      font-size: 32px;
      color: #ff4d4f;
      font-weight: bold;
    }

    .original-price {
      font-size: 16px;
      color: #999;
      text-decoration: line-through;
      margin-left: 16px;
    }
  }

  .product-meta {
    .meta-item {
      .label {
        color: #666;
      }

      .value {
        color: #333;
        font-weight: 500;
      }
    }
  }

  .product-shop {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;

    .shop-name {
      color: #1890ff;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .product-actions {
    margin-top: 24px;
  }
}
</style>
