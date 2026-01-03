import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listBannerUsingGet } from '@/api/lunbotujiekou'
import type { Banner } from '@/types/models'

export const useBannerStore = defineStore('banner', () => {
  const bannerList = ref<Banner[]>([])
  const loading = ref(false)

  async function fetchBannerList() {
    loading.value = true
    try {
      const res = await listBannerUsingGet()
      if (res.code === 0 && res.data) {
        bannerList.value = res.data as Banner[]
      }
    } catch (error) {
      console.error('获取轮播图列表失败', error)
    } finally {
      loading.value = false
    }
  }

  return {
    bannerList,
    loading,
    fetchBannerList,
  }
})