<template>
  <a-layout class="admin-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <h2>管理后台</h2>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" theme="dark" mode="inline">
        <a-menu-item key="dashboard" @click="$router.push('/admin')">
          <dashboard-outlined />
          <span>数据概览</span>
        </a-menu-item>
        <a-menu-item key="users" @click="$router.push('/admin/users')">
          <user-outlined />
          <span>用户管理</span>
        </a-menu-item>
        <a-sub-menu key="product-sub">
          <template #icon>
            <appstore-outlined />
          </template>
          <template #title>商品管理</template>
          <a-menu-item key="products" @click="$router.push('/admin/products')">商品审核</a-menu-item>
          <a-menu-item key="product-manage" @click="$router.push('/admin/product-manage')">商品管理</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="shop-sub">
          <template #icon>
            <shop-outlined />
          </template>
          <template #title>店铺管理</template>
          <a-menu-item key="shops" @click="$router.push('/admin/shops')">店铺审核</a-menu-item>
          <a-menu-item key="shop-manage" @click="$router.push('/admin/shop-manage')">店铺管理</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="categories" @click="$router.push('/admin/categories')">
          <apartment-outlined />
          <span>分类管理</span>
        </a-menu-item>
        <a-menu-item key="orders" @click="$router.push('/admin/orders')">
          <shopping-outlined />
          <span>订单管理</span>
        </a-menu-item>
        <a-menu-item key="banners" @click="$router.push('/admin/banners')">
          <picture-outlined />
          <span>轮播图管理</span>
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
            <a-avatar :src="userStore.userInfo?.userAvatar" :size="40" class="user-avatar">
              {{ userStore.userInfo?.userName?.charAt(0) || 'U' }}
            </a-avatar>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="$router.push('/user/profile')">个人中心</a-menu-item>
                <a-menu-divider />
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
  UserOutlined,
  AppstoreOutlined,
  ShopOutlined,
  ApartmentOutlined,
  ShoppingOutlined,
  PictureOutlined,
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref(['dashboard'])
const openKeys = ref<string[]>([])

const handleLogout = async () => {
  await userStore.logout()
  message.success('退出登录成功')
  router.push('/login')
}
</script>

<style scoped lang="less">
.admin-layout {
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

    .user-avatar {
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

.content {
  margin: 24px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
}
</style>