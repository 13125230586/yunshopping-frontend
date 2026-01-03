import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getCartListUsingGet,
  addToCartUsingPost,
  updateQuantityUsingPost,
  deleteCartItemUsingPost,
  clearCartUsingPost,
} from '@/api/cartController'
import type { CartItem } from '@/types/models'

export const useCartStore = defineStore('cart', () => {
  const cartList = ref<CartItem[]>([])
  const loading = ref(false)

  const checkedList = computed(() => cartList.value.filter((item) => item.isChecked === 1))

  const checkedCount = computed(() => checkedList.value.length)

  const totalAmount = computed(() => {
    return checkedList.value.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  })

  const totalCount = computed(() => {
    return cartList.value.reduce((total, item) => total + item.quantity, 0)
  })

  async function fetchCartList() {
    loading.value = true
    try {
      const res = await getCartListUsingGet()
      if (res.code === 0 && res.data) {
        cartList.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  async function addToCart(productId: number, quantity: number, specification?: string) {
    const res = await addToCartUsingPost({
      productId,
      quantity,
      specification: specification || '',
    })
    if (res.code === 0) {
      await fetchCartList()
    }
    return res
  }

  async function updateQuantity(cartId: number, quantity: number) {
    const res = await updateQuantityUsingPost({ cartId, quantity })
    if (res.code === 0) {
      await fetchCartList()
    }
    return res
  }

  async function deleteCartItem(id: number) {
    const res = await deleteCartItemUsingPost({ id })
    if (res.code === 0) {
      await fetchCartList()
    }
    return res
  }

  async function clearCart() {
    const res = await clearCartUsingPost()
    if (res.code === 0) {
      cartList.value = []
    }
    return res
  }

  function toggleCheck(id: number) {
    const item = cartList.value.find((item) => item.id === id)
    if (item) {
      item.isChecked = item.isChecked === 1 ? 0 : 1
    }
  }

  function toggleAllCheck() {
    const allChecked = cartList.value.every((item) => item.isChecked === 1)
    cartList.value.forEach((item) => {
      item.isChecked = allChecked ? 0 : 1
    })
  }

  return {
    cartList,
    loading,
    checkedList,
    checkedCount,
    totalAmount,
    totalCount,
    fetchCartList,
    addToCart,
    updateQuantity,
    deleteCartItem,
    clearCart,
    toggleCheck,
    toggleAllCheck,
  }
})