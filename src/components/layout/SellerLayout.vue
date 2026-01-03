<template>
  <a-layout class="seller-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <h2>卖家中心</h2>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="dashboard" @click="$router.push('/seller')">
          <dashboard-outlined />
          <span>工作台</span>
        </a-menu-item>
        <a-menu-item key="products" @click="$router.push('/seller/products')">
          <appstore-outlined />
          <span>商品管理</span>
        </a-menu-item>
        <a-menu-item key="orders" @click="$router.push('/seller/orders')">
          <shopping-outlined />
          <span>订单管理</span>
        </a-menu-item>
        <a-menu-item key="shop" @click="$router.push('/seller/shop')">
          <shop-outlined />
          <span>店铺管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="collapsed = !collapsed" />
        <menu-fold-outlined v-else class="trigger" @click="collapsed = !collapsed" />
        <div class="header-right">
          <a-button @click="$router.push('/')">返回商城</a-button>
          <a-dropdown>
            <a-avatar>{{ userStore.userInfo?.userName?.charAt(0) }}</a-avatar>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="handleLogout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  ShopOutlined,
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref(['dashboard'])

const handleLogout = async () => {
  await userStore.logout()
  message.success('退出登录成功')
  router.push('/login')
}
</script>

<style scoped lang="less">
.seller-layout {
  min-height: 100vh;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);

  h2 {
    color: #fff;
    margin: 0;
    font-size: 18px;
  }
}

.header {
  background: #fff;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .trigger {
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #1890ff;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.content {
  margin: 24px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
}
</style>