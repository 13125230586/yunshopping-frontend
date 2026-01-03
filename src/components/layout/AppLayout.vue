<template>
  <a-layout class="app-layout">
    <a-layout-header class="app-header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <h1>网上商城系统</h1>
        </div>
        <div class="search-box">
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索商品"
            enter-button="搜索"
            size="large"
            @search="handleSearch"
          />
        </div>
        <div class="header-actions">
          <a-badge :count="cartCount" :offset="[10, 0]">
            <a-button type="text" @click="$router.push('/cart')">
              <shopping-cart-outlined /> 购物车
            </a-button>
          </a-badge>
          <template v-if="userStore.isLogin">
            <a-dropdown>
              <a-button type="text">
                <user-outlined /> {{ userStore.userInfo?.userName || '用户' }}
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="$router.push('/user/profile')">个人中心</a-menu-item>
                  <a-menu-item @click="$router.push('/user/orders')">我的订单</a-menu-item>
                  <a-menu-item v-if="userStore.isSeller" @click="$router.push('/seller')">
                    卖家中心
                  </a-menu-item>
                  <a-menu-item v-if="!userStore.isSeller && !userStore.isAdmin" @click="$router.push('/seller/apply')">
                    我要开店
                  </a-menu-item>
                  <a-menu-item v-if="userStore.isAdmin" @click="$router.push('/admin')">
                    管理后台
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item @click="handleLogout">退出登录</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <template v-else>
            <a-button type="primary" @click="$router.push('/login')">登录</a-button>
            <a-button @click="$router.push('/register')">注册</a-button>
          </template>
        </div>
      </div>
      <div class="nav-menu">
        <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal">
          <a-menu-item key="home" @click="$router.push('/')">首页</a-menu-item>
          <a-menu-item key="products" @click="$router.push('/products')">全部商品</a-menu-item>
          <a-sub-menu key="categories" title="商品分类">
            <a-menu-item
              v-for="category in categoryStore.categoryTree"
              :key="category.id"
              @click="handleCategoryClick(category.id)"
            >
              {{ category.categoryName }}
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>
    </a-layout-header>
    <a-layout-content class="app-content">
      <router-view />
    </a-layout-content>
    <a-layout-footer class="app-footer">
      <div class="footer-content">
        <p>网上商城系统 © 2026 版权所有</p>
        <p>云商城系统 - 多店铺B2C电商平台</p>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useCategoryStore } from '@/stores/category'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const categoryStore = useCategoryStore()
const appStore = useAppStore()

const searchKeyword = ref('')
const selectedKeys = ref(['home'])

const cartCount = computed(() => cartStore.totalCount)

onMounted(async () => {
  userStore.initUser()
  if (userStore.isLogin) {
    await cartStore.fetchCartList()
  }
  await categoryStore.fetchCategoryTree()
})

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/products',
      query: { keyword: searchKeyword.value },
    })
  }
}

const handleCategoryClick = (categoryId: number) => {
  router.push({
    path: '/products',
    query: { categoryId },
  })
}

const handleLogout = async () => {
  await userStore.logout()
  message.success('退出登录成功')
  router.push('/')
}
</script>

<style scoped lang="less">
.app-layout {
  min-height: 100vh;
}

.app-header {
  background: #fff;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 999;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 20px;
    height: 64px;

    .logo {
      cursor: pointer;
      h1 {
        margin: 0;
        font-size: 24px;
        color: #1890ff;
      }
    }

    .search-box {
      flex: 1;
      max-width: 600px;
      margin: 0 40px;
    }

    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }
  }

  .nav-menu {
    max-width: 1600px;
    margin: 0 auto;
    border-top: 1px solid #f0f0f0;
  }
}

.app-content {
  min-height: calc(100vh - 264px);
  background: #f5f5f5;
}

.app-footer {
  text-align: center;
  background: #001529;
  color: #fff;

  .footer-content {
    max-width: 1600px;
    margin: 0 auto;

    p {
      margin: 8px 0;
      color: rgba(255, 255, 255, 0.65);
    }
  }
}
</style>