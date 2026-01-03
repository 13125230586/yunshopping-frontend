<template>
  <div class="product-card" @click="handleClick">
    <div class="product-image">
      <img
        :src="product.mainImageUrl || defaultImage"
        :alt="product.productName"
        @error="handleImageError"
      />
      <div v-if="product.tags" class="product-tags">
        <a-tag v-for="(tag, index) in parsedTags" :key="index" color="red">{{ tag }}</a-tag>
      </div>
    </div>
    <div class="product-info">
      <div class="product-title">{{ product.productTitle || product.productName }}</div>
      <div class="product-desc">{{ product.productDescription }}</div>
      <div class="product-footer">
        <div class="product-price">
          <span class="price">{{ formatPrice(product.price) }}</span>
          <span v-if="product.originalPrice" class="original-price">
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>
        <div class="product-meta">
          <span>销量 {{ formatNumber(product.sales || 0) }}</span>
        </div>
      </div>
      <div class="product-shop">
        <shop-outlined />
        <span>{{ product.shopName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ShopOutlined } from '@ant-design/icons-vue'
import type { Product } from '@/types/models'
import { formatPrice, formatNumber, parseJSON } from '@/utils'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()

// 默认商品图片
const defaultImage = ref(
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
)

const parsedTags = computed(() => {
  if (!props.product.tags) return []
  return parseJSON<string[]>(props.product.tags, [])
})

const handleClick = () => {
  router.push(`/product/${props.product.id}`)
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = defaultImage.value
}
</script>

<style scoped lang="less">
.product-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  background: #fff;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }

  .product-image {
    position: relative;
    width: 100%;
    height: 240px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-tags {
      position: absolute;
      top: 8px;
      left: 8px;
    }
  }

  .product-info {
    padding: 12px;

    .product-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-desc {
      font-size: 12px;
      color: #666;
      margin-bottom: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .product-price {
        .price {
          font-size: 20px;
          color: #ff4d4f;
          font-weight: bold;
        }

        .original-price {
          font-size: 12px;
          color: #999;
          text-decoration: line-through;
          margin-left: 8px;
        }
      }

      .product-meta {
        font-size: 12px;
        color: #999;
      }
    }

    .product-shop {
      font-size: 12px;
      color: #666;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}
</style>