<template>
  <div class="order-confirm-page">
    <div class="page-container">
      <a-card title="确认订单">
        <a-form :model="orderForm" layout="vertical">
          <a-form-item label="收货地址">
            <address-selector v-model:value="orderForm.addressId" />
          </a-form-item>
          <a-divider />
          <a-form-item label="商品清单">
            <div class="order-items">
              <div v-for="item in cartStore.checkedList" :key="item.id" class="order-item">
                <img :src="item.productImage" />
                <div class="item-info">
                  <div>{{ item.productName }}</div>
                  <div>{{ formatPrice(item.price) }} × {{ item.quantity }}</div>
                </div>
                <div class="item-total">{{ formatPrice(item.price * item.quantity) }}</div>
              </div>
            </div>
          </a-form-item>
          <a-form-item label="买家留言">
            <a-textarea v-model:value="orderForm.buyerMessage" :rows="3" />
          </a-form-item>
          <a-divider />
          <div class="order-summary">
            <div class="summary-item">
              <span>商品总额：</span>
              <span>{{ formatPrice(cartStore.totalAmount) }}</span>
            </div>
            <div class="summary-item total">
              <span>应付总额：</span>
              <span class="amount">{{ formatPrice(cartStore.totalAmount) }}</span>
            </div>
          </div>
          <a-button type="primary" size="large" block @click="handleSubmit" :loading="loading">
            提交订单
          </a-button>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { formatPrice } from '@/utils'
import AddressSelector from '@/components/business/AddressSelector.vue'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const loading = ref(false)

const orderForm = reactive({
  addressId: 0,
  buyerMessage: '',
})

onMounted(async () => {
  await cartStore.fetchCartList()
  if (cartStore.checkedCount === 0) {
    message.warning('请先选择商品')
    router.push('/cart')
  }
})

const handleSubmit = async () => {
  if (!orderForm.addressId) {
    message.warning('请选择收货地址')
    return
  }

  loading.value = true
  try {
    const shopMap = new Map()
    cartStore.checkedList.forEach(item => {
      if (!shopMap.has(item.shopId)) {
        shopMap.set(item.shopId, [])
      }
      shopMap.get(item.shopId).push(item.id)
    })

    for (const [shopId, cartIds] of shopMap) {
      await orderStore.createOrder({
        shopId,
        cartIds,
        addressId: orderForm.addressId,
        buyerMessage: orderForm.buyerMessage,
      })
    }

    message.success('订单创建成功')
    router.push('/user/orders')
  } catch (error: any) {
    message.error(error.message || '创建订单失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="less">
.order-confirm-page {
  background: #f5f5f5;
  min-height: calc(100vh - 264px);
  padding: 24px 0;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.order-items {
  .order-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border: 1px solid #f0f0f0;
    margin-bottom: 8px;

    img {
      width: 80px;
      height: 80px;
      object-fit: cover;
    }

    .item-info {
      flex: 1;
    }

    .item-total {
      font-weight: bold;
      color: #ff4d4f;
    }
  }
}

.order-summary {
  padding: 16px;
  background: #fafafa;

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    &.total {
      font-size: 18px;
      font-weight: bold;

      .amount {
        color: #ff4d4f;
        font-size: 24px;
      }
    }
  }
}
</style>
