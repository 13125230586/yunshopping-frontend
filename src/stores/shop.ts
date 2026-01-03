import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listShopByPageUsingPost, getShopByIdUsingGet } from '@/api/shopController'
import type { Shop } from '@/types/models'
import type { Page } from '@/types/global'

export const useShopStore = defineStore('shop', () => {
  const shopList = ref<Shop[]>([])
  const shopDetail = ref<Shop | null>(null)
  const total = ref(0)
  const loading = ref(false)

  async function fetchShopList(params: any) {
    loading.value = true
    try {
      const res = await listShopByPageUsingPost(params)
      if (res.code === 0 && res.data) {
        const pageData = res.data as Page<Shop>
        shopList.value = pageData.records
        total.value = Number(pageData.total) || 0
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchShopDetail(id: number) {
    loading.value = true
    try {
      const res = await getShopByIdUsingGet({ id })
      if (res.code === 0 && res.data) {
        shopDetail.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  return {
    shopList,
    shopDetail,
    total,
    loading,
    fetchShopList,
    fetchShopDetail,
  }
})