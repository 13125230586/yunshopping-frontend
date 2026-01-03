<template>
  <div class="shop-detail">
    <div class="page-container">
      <div class="shop-header-section">
        <div class="shop-header">
          <img :src="shop?.shopLogo" class="shop-logo" />
          <div class="shop-info">
            <h1>{{ shop?.shopName }}</h1>
            <p>{{ shop?.shopDescription }}</p>
          </div>
        </div>
      </div>
      <a-card class="product-section">
        <h2>店铺商品</h2>
        <div class="product-grid">
          <product-card v-for="product in productStore.productList" :key="product.id" :product="product" />
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useShopStore } from '@/stores/shop'
import { useProductStore } from '@/stores/product'
import ProductCard from '@/components/business/ProductCard.vue'

const route = useRoute()
const shopStore = useShopStore()
const productStore = useProductStore()
const shop = ref()

onMounted(async () => {
  const shopId = Number(route.params.id)
  await shopStore.fetchShopDetail(shopId)
  shop.value = shopStore.shopDetail
  await productStore.fetchProductList({ shopId, current: 1, pageSize: 12 })
})
</script>

<style scoped lang="less">
.shop-detail {
  padding-top: 60px;
  min-height: calc(100vh - 264px);
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.shop-header-section {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.shop-header {
  display: flex;
  gap: 24px;

  .shop-logo {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid #f0f0f0;
  }

  .shop-info {
    flex: 1;

    h1 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #333;
    }

    p {
      color: #666;
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
    }
  }
}

.product-section {
  h2 {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
</style>
