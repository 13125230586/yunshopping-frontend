import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listProductByPageUsingPost, getProductByIdUsingGet } from '@/api/productController'
import type { Product } from '@/types/models'
import type { Page } from '@/types/global'

export const useProductStore = defineStore('product', () => {
  const productList = ref<Product[]>([])
  const productDetail = ref<Product | null>(null)
  const total = ref(0)
  const loading = ref(false)

  async function fetchProductList(params: any) {
    loading.value = true
    try {
      const res = await listProductByPageUsingPost(params)
      if (res.code === 0 && res.data) {
        const pageData = res.data as Page<Product>
        productList.value = pageData.records
        total.value = Number(pageData.total) || 0
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchProductDetail(id: number) {
    loading.value = true
    try {
      const res = await getProductByIdUsingGet({ id })
      if (res.code === 0 && res.data) {
        productDetail.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  return {
    productList,
    productDetail,
    total,
    loading,
    fetchProductList,
    fetchProductDetail,
  }
})