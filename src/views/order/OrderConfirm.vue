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

          <!-- 优惠券选择 -->
          <a-form-item label="优惠券">
            <a-select
              v-model:value="orderForm.couponId"
              placeholder="请选择优惠券"
              allow-clear
              style="width: 100%"
              @change="handleCouponChange"
            >
              <a-select-option :value="undefined">不使用优惠券</a-select-option>
              <a-select-option
                v-for="coupon in availableCoupons"
                :key="coupon.id"
                :value="coupon.couponId"
              >
                <div class="coupon-option">
                  <span>{{ coupon.couponName }}</span>
                  <span class="coupon-desc">{{ getCouponDesc(coupon) }}</span>
                </div>
              </a-select-option>
            </a-select>
            <div v-if="!availableCoupons.length" class="no-coupon-tip">
              暂无可用优惠券
            </div>
          </a-form-item>

          <a-form-item label="买家留言">
            <a-textarea v-model:value="orderForm.buyerMessage" :rows="3" />
          </a-form-item>
          <a-divider />

          <!-- 价格明细 -->
          <div class="order-summary">
            <div class="summary-item">
              <span>商品总额：</span>
              <span>{{ formatPrice(originalAmount) }}</span>
            </div>

            <!-- 会员折扣 -->
            <div v-if="memberStore.isMember" class="summary-item member-discount">
              <span>
                <crown-outlined style="color: #ffd700; margin-right: 4px" />
                会员折扣（{{ memberDiscountText }}）：
              </span>
              <span class="discount-amount">-{{ formatPrice(memberDiscountAmount) }}</span>
            </div>

            <!-- 优惠券优惠 -->
            <div v-if="couponDiscountAmount > 0" class="summary-item coupon-discount">
              <span>
                <gift-outlined style="color: #ff4d4f; margin-right: 4px" />
                优惠券优惠：
              </span>
              <span class="discount-amount">-{{ formatPrice(couponDiscountAmount) }}</span>
            </div>

            <!-- 优惠后小计 -->
            <div v-if="totalDiscountAmount > 0" class="summary-item subtotal">
              <span>优惠后小计：</span>
              <span>{{ formatPrice(discountedAmount) }}</span>
            </div>

            <div class="summary-item total">
              <span>应付总额：</span>
              <span class="amount">{{ formatPrice(finalAmount) }}</span>
            </div>

            <!-- 优惠提示 -->
            <div v-if="totalDiscountAmount > 0" class="discount-tip">
              已为您节省 <span class="saved-amount">{{ formatPrice(totalDiscountAmount) }}</span>
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
import { reactive, ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { CrownOutlined, GiftOutlined } from '@ant-design/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useMemberStore } from '@/stores/member'
import { formatPrice } from '@/utils'
import AddressSelector from '@/components/business/AddressSelector.vue'
import { getAvailableCouponsUsingGet } from '@/api/youhuiquanjiekou'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const memberStore = useMemberStore()
const loading = ref(false)

const orderForm = reactive({
  addressId: 0,
  buyerMessage: '',
  couponId: undefined as number | undefined,
})

// 从后端获取的优惠券列表
const allCoupons = ref<API.UserCouponVO[]>([])

// 原始金额
const originalAmount = computed(() => cartStore.totalAmount)

// 会员折扣率
const memberDiscountRate = computed(() => {
  if (!memberStore.isMember || !memberStore.currentLevel) {
    return 1
  }
  return memberStore.currentLevel.discountRate || 1
})

// 会员折扣文本
const memberDiscountText = computed(() => {
  if (!memberStore.isMember) return ''
  const rate = memberDiscountRate.value
  return `${(rate * 10).toFixed(1)}折`
})

// 会员折扣金额
const memberDiscountAmount = computed(() => {
  if (!memberStore.isMember) return 0
  const rate = memberDiscountRate.value
  return originalAmount.value * (1 - rate)
})

// 会员折扣后的金额
const afterMemberDiscount = computed(() => {
  return originalAmount.value - memberDiscountAmount.value
})

// 只返回后端标记为可用的优惠券
const availableCoupons = computed(() => {
  return allCoupons.value.filter(coupon => coupon.canUse === true)
})

// 选中的优惠券
const selectedCoupon = computed(() => {
  if (!orderForm.couponId) return null
  return allCoupons.value.find(c => c.couponId === orderForm.couponId) || null
})

// 优惠券优惠金额
const couponDiscountAmount = computed(() => {
  if (!selectedCoupon.value) return 0
  const coupon = selectedCoupon.value

  // 根据优惠券类型计算折扣金额
  if (coupon.couponType === 1 && coupon.discountAmount) {
    return coupon.discountAmount
  }

  // 折扣券
  if (coupon.couponType === 2 && coupon.discountRate) {
    return afterMemberDiscount.value * (1 - coupon.discountRate)
  }

  // 其他类型，如果有固定折扣金额则使用
  return coupon.discountAmount || 0
})

// 总优惠金额
const totalDiscountAmount = computed(() => {
  return memberDiscountAmount.value + couponDiscountAmount.value
})

// 优惠后金额
const discountedAmount = computed(() => {
  return originalAmount.value - totalDiscountAmount.value
})

// 最终应付金额
const finalAmount = computed(() => {
  const amount = discountedAmount.value
  return amount > 0 ? amount : 0
})

// 监听会员折扣后的金额变化，重新获取可用优惠券
watch(afterMemberDiscount, async (newAmount) => {
  if (newAmount > 0) {
    await fetchAvailableCoupons()
  }
})

// 获取可用优惠券列表
async function fetchAvailableCoupons() {
  try {
    const res = await getAvailableCouponsUsingGet({
      orderAmount: afterMemberDiscount.value,
    })
    console.log('可用优惠券接口响应 res:', res)
    console.log('可用优惠券接口响应 res.data:', res.data)

    if (res.code === 0 && res.data) {
      allCoupons.value = res.data
      console.log('可用优惠券加载成功 数量:', allCoupons.value.length)
    } else if (res.data?.code === 0 && res.data.data) {
      // 兼容嵌套格式
      allCoupons.value = res.data.data
      console.log('可用优惠券加载成功 数量:', allCoupons.value.length)
    } else {
      console.warn('优惠券接口返回异常 code:', res.code, 'data:', res.data)
    }
  } catch (error) {
    console.error('获取优惠券列表失败', error)
  }
}

// 生成优惠券描述文本
function getCouponDesc(coupon: API.UserCouponVO) {
  if (coupon.couponType === 1 && coupon.discountAmount && coupon.minAmount) {
    return `满${coupon.minAmount}减${coupon.discountAmount}`
  }
  if (coupon.couponType === 2 && coupon.discountRate) {
    return `${(coupon.discountRate * 10).toFixed(1)}折优惠券`
  }
  return coupon.couponTypeText || ''
}

onMounted(async () => {
  await cartStore.fetchCartList()
  await memberStore.fetchMemberInfo()

  if (cartStore.checkedCount === 0) {
    message.warning('请先选择商品')
    router.push('/cart')
    return
  }

  await fetchAvailableCoupons()
})

function handleCouponChange() {
  console.log('选中的优惠券ID:', orderForm.couponId)
}

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
        couponId: orderForm.couponId,
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
    border-radius: 4px;
    background: #fff;

    img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }

    .item-info {
      flex: 1;

      > div:first-child {
        font-size: 14px;
        margin-bottom: 8px;
      }

      > div:last-child {
        color: #999;
        font-size: 12px;
      }
    }

    .item-total {
      font-weight: bold;
      color: #ff4d4f;
      font-size: 16px;
    }
  }
}

.coupon-option {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .coupon-desc {
    color: #999;
    font-size: 12px;
    margin-left: 12px;
  }
}

.no-coupon-tip {
  color: #999;
  font-size: 12px;
  margin-top: 8px;
}

.order-summary {
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;

    &.member-discount,
    &.coupon-discount {
      color: #52c41a;

      .discount-amount {
        color: #52c41a;
        font-weight: 500;
      }
    }

    &.subtotal {
      padding-top: 8px;
      border-top: 1px dashed #e0e0e0;
      font-weight: 500;
    }

    &.total {
      font-size: 18px;
      font-weight: bold;
      padding-top: 12px;
      border-top: 2px solid #e0e0e0;
      margin-top: 8px;

      .amount {
        color: #ff4d4f;
        font-size: 26px;
      }
    }
  }

  .discount-tip {
    margin-top: 12px;
    padding: 8px;
    background: #fff7e6;
    border: 1px solid #ffd591;
    border-radius: 4px;
    text-align: center;
    color: #fa8c16;
    font-size: 13px;

    .saved-amount {
      font-weight: bold;
      color: #ff4d4f;
      font-size: 16px;
    }
  }
}
</style>
