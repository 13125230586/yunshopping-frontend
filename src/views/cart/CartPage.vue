<template>
  <div class="cart-page">
    <div class="page-container">
      <a-card title="购物车" class="cart-card">
        <a-spin :spinning="cartStore.loading">
          <a-empty v-if="cartStore.cartList.length === 0" description="购物车是空的">
            <a-button type="primary" @click="$router.push('/products')">去逛逛</a-button>
          </a-empty>
          <template v-else>
            <div class="cart-header">
              <a-checkbox
                :checked="allChecked"
                @change="cartStore.toggleAllCheck"
              >
                全选
              </a-checkbox>
              <span class="item-count">共 {{ cartStore.cartList.length }} 件商品</span>
            </div>
            <div class="cart-list">
              <div v-for="item in cartStore.cartList" :key="item.id" class="cart-item">
                <a-checkbox
                  :checked="item.isChecked === 1"
                  @change="cartStore.toggleCheck(item.id)"
                />
                <img :src="item.productImage" :alt="item.productName" class="item-image" />
                <div class="item-info">
                  <div class="item-name">{{ item.productName }}</div>
                  <div class="item-shop">{{ item.shopName }}</div>
                </div>
                <div class="item-price">{{ formatPrice(item.price) }}</div>
                <a-input-number
                  :value="item.quantity"
                  :min="1"
                  :max="item.stock"
                  @change="(value: number) => handleQuantityChange(item.id, value)"
                  class="item-quantity"
                />
                <div class="item-total">{{ formatPrice(item.price * item.quantity) }}</div>
                <a-button type="text" danger @click="handleDelete(item.id)">删除</a-button>
              </div>
            </div>
            <div class="cart-footer">
              <div class="footer-left">
                <a-button @click="handleClearCart">清空购物车</a-button>
              </div>
              <div class="footer-right">
                <span class="total-text">
                  已选 {{ cartStore.checkedCount }} 件，总计：
                  <span class="total-amount">{{ formatPrice(cartStore.totalAmount) }}</span>
                </span>
                <a-button
                  type="primary"
                  size="large"
                  :disabled="cartStore.checkedCount === 0"
                  @click="handleCheckout"
                >
                  去结算
                </a-button>
              </div>
            </div>
          </template>
        </a-spin>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils'

const router = useRouter()
const cartStore = useCartStore()

const allChecked = computed(() => {
  return cartStore.cartList.length > 0 && cartStore.cartList.every((item) => item.isChecked === 1)
})

onMounted(() => {
  cartStore.fetchCartList()
})

const handleQuantityChange = async (cartId: number, quantity: number) => {
  try {
    await cartStore.updateQuantity(cartId, quantity)
  } catch (error: any) {
    message.error(error.message || '更新失败')
  }
}

const handleDelete = (cartId: number) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除该商品吗？',
    onOk: async () => {
      try {
        await cartStore.deleteCartItem(cartId)
        message.success('删除成功')
      } catch (error: any) {
        message.error(error.message || '删除失败')
      }
    },
  })
}

const handleClearCart = () => {
  Modal.confirm({
    title: '确认清空',
    content: '确定要清空购物车吗？',
    onOk: async () => {
      try {
        await cartStore.clearCart()
        message.success('清空成功')
      } catch (error: any) {
        message.error(error.message || '清空失败')
      }
    },
  })
}

const handleCheckout = () => {
  router.push('/order/confirm')
}
</script>

<style scoped lang="less">
.cart-page {
  background: #f5f5f5;
  min-height: calc(100vh - 264px);
  padding: 24px 0;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.cart-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fafafa;
  margin-bottom: 16px;

  .item-count {
    margin-left: 16px;
    color: #666;
  }
}

.cart-list {
  .cart-item {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    gap: 16px;

    .item-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }

    .item-info {
      flex: 1;

      .item-name {
        font-size: 14px;
        margin-bottom: 8px;
      }

      .item-shop {
        font-size: 12px;
        color: #666;
      }
    }

    .item-price {
      width: 120px;
      text-align: center;
      color: #ff4d4f;
      font-weight: bold;
    }

    .item-quantity {
      width: 120px;
    }

    .item-total {
      width: 120px;
      text-align: center;
      font-size: 16px;
      color: #ff4d4f;
      font-weight: bold;
    }
  }
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fafafa;
  margin-top: 16px;

  .footer-right {
    display: flex;
    align-items: center;
    gap: 24px;

    .total-text {
      font-size: 14px;

      .total-amount {
        font-size: 24px;
        color: #ff4d4f;
        font-weight: bold;
        margin-left: 8px;
      }
    }
  }
}
</style>