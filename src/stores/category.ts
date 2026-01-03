import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategoryTreeUsingGet } from '@/api/categoryController'
import type { Category } from '@/types/models'

export const useCategoryStore = defineStore('category', () => {
  const categoryTree = ref<Category[]>([])
  const loading = ref(false)

  async function fetchCategoryTree() {
    loading.value = true
    try {
      const res = await getCategoryTreeUsingGet()
      if (res.code === 0 && res.data) {
        categoryTree.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  function getCategoryById(id: number): Category | null {
    const findCategory = (list: Category[]): Category | null => {
      for (const category of list) {
        if (category.id === id) {
          return category
        }
        if (category.children) {
          const found = findCategory(category.children)
          if (found) return found
        }
      }
      return null
    }
    return findCategory(categoryTree.value)
  }

  function getCategoryPath(id: number): Category[] {
    const path: Category[] = []
    const findPath = (list: Category[], targetId: number): boolean => {
      for (const category of list) {
        if (category.id === targetId) {
          path.push(category)
          return true
        }
        if (category.children) {
          if (findPath(category.children, targetId)) {
            path.unshift(category)
            return true
          }
        }
      }
      return false
    }
    findPath(categoryTree.value, id)
    return path
  }

  return {
    categoryTree,
    loading,
    fetchCategoryTree,
    getCategoryById,
    getCategoryPath,
  }
})