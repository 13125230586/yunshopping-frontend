import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getLoginUserUsingGet, userLoginUsingPost, userLogoutUsingPost } from '@/api/yonghujiekou'
import type { User } from '@/types/models'
import { storage } from '@/utils'
import { UserRole } from '@/constants'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<User | null>(null)

  const isLogin = computed(() => !!userInfo.value)
  const isBuyer = computed(() => userInfo.value?.userRole === UserRole.BUYER)
  const isSeller = computed(() => userInfo.value?.userRole === UserRole.SELLER)
  const isAdmin = computed(() => userInfo.value?.userRole === UserRole.ADMIN)

  async function login(userAccount: string, userPassword: string) {
    const res = await userLoginUsingPost({ userAccount, userPassword })
    if (res.code === 0 && res.data) {
      userInfo.value = res.data as User
      storage.set('userInfo', res.data)
    }
    return res
  }

  async function logout() {
    await userLogoutUsingPost()
    userInfo.value = null
    storage.remove('userInfo')
  }

  async function fetchLoginUser() {
    try {
      const res = await getLoginUserUsingGet()
      if (res.code === 0 && res.data) {
        userInfo.value = res.data as User
        storage.set('userInfo', res.data)
      }
    } catch (error) {
      console.error('获取登录用户失败', error)
    }
  }

  function initUser() {
    const localUser = storage.get('userInfo')
    if (localUser) {
      userInfo.value = localUser
    }
  }

  function updateUserInfo(user: User) {
    userInfo.value = user
    storage.set('userInfo', user)
  }

  return {
    userInfo,
    isLogin,
    isBuyer,
    isSeller,
    isAdmin,
    login,
    logout,
    fetchLoginUser,
    initUser,
    updateUserInfo,
  }
})