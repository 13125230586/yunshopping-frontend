import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  listOrderByPageUsingPost,
  getOrderDetailUsingGet,
  createOrderUsingPost,
  cancelOrderUsingPost,
  confirmReceiptUsingPost,
  deleteOrderUsingPost,
} from '@/api/orderController'
import type { Order } from '@/types/models'
import type { Page } from '@/types/global'

export const useOrderStore = defineStore('order', () => {
  const orderList = ref<Order[]>([])
  const orderDetail = ref<Order | null>(null)
  const total = ref(0)
  const loading = ref(false)

  async function fetchOrderList(params: any) {
    loading.value = true
    try {
      const res = await listOrderByPageUsingPost(params)
      if (res.code === 0 && res.data) {
        const pageData = res.data as Page<Order>
        orderList.value = pageData.records
        total.value = Number(pageData.total) || 0
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderDetail(orderId: number) {
    loading.value = true
    try {
      const res = await getOrderDetailUsingGet({ orderId })
      if (res.code === 0 && res.data) {
        orderDetail.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  async function createOrder(params: {
    shopId: number
    cartIds: number[]
    addressId: number
    buyerMessage?: string
    couponId?: number
  }) {
    const res = await createOrderUsingPost(params)
    return res
  }

  async function cancelOrder(orderId: number) {
    const res = await cancelOrderUsingPost({ orderId })
    if (res.code === 0) {
      await fetchOrderList({ current: 1, pageSize: 10 })
    }
    return res
  }

  async function confirmReceipt(orderId: number) {
    const res = await confirmReceiptUsingPost({ orderId })
    if (res.code === 0) {
      await fetchOrderList({ current: 1, pageSize: 10 })
    }
    return res
  }

  async function deleteOrder(orderId: number) {
    const res = await deleteOrderUsingPost({ orderId })
    if (res.code === 0) {
      await fetchOrderList({ current: 1, pageSize: 10 })
    }
    return res
  }

  return {
    orderList,
    orderDetail,
    total,
    loading,
    fetchOrderList,
    fetchOrderDetail,
    createOrder,
    cancelOrder,
    confirmReceipt,
    deleteOrder,
  }
})