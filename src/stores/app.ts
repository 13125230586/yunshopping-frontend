import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const collapsed = ref(false)
  const loading = ref(false)
  const searchKeyword = ref('')

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setSearchKeyword(keyword: string) {
    searchKeyword.value = keyword
  }

  return {
    collapsed,
    loading,
    searchKeyword,
    toggleCollapsed,
    setLoading,
    setSearchKeyword,
  }
})