import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/components/layout/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/IndexPage.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'products',
        name: 'ProductList',
        component: () => import('@/views/product/ProductList.vue'),
        meta: { title: '商品列表' },
      },
      {
        path: 'product/:id',
        name: 'ProductDetail',
        component: () => import('@/views/product/ProductDetail.vue'),
        meta: { title: '商品详情' },
      },
      {
        path: 'shop/:id',
        name: 'ShopDetail',
        component: () => import('@/views/shop/ShopDetail.vue'),
        meta: { title: '店铺详情' },
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/cart/CartPage.vue'),
        meta: { title: '购物车', requiresAuth: true },
      },
      {
        path: 'order/confirm',
        name: 'OrderConfirm',
        component: () => import('@/views/order/OrderConfirm.vue'),
        meta: { title: '确认订单', requiresAuth: true },
      },
      {
        path: 'user',
        name: 'UserCenter',
        meta: { title: '个人中心', requiresAuth: true },
        redirect: '/user/profile',
        children: [
          {
            path: 'profile',
            name: 'UserProfile',
            component: () => import('@/views/user/UserProfile.vue'),
            meta: { title: '个人信息', requiresAuth: true },
          },
          {
            path: 'orders',
            name: 'UserOrders',
            component: () => import('@/views/user/UserOrders.vue'),
            meta: { title: '我的订单', requiresAuth: true },
          },
          {
            path: 'address',
            name: 'UserAddress',
            component: () => import('@/views/user/UserAddress.vue'),
            meta: { title: '收货地址', requiresAuth: true },
          },
          {
            path: 'favorites',
            name: 'UserFavorites',
            component: () => import('@/views/user/UserFavorites.vue'),
            meta: { title: '我的收藏', requiresAuth: true },
          },
          {
            path: 'member',
            name: 'UserMember',
            component: () => import('@/views/user/UserMember.vue'),
            meta: { title: '会员中心', requiresAuth: true },
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginPage.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterPage.vue'),
    meta: { title: '注册' },
  },
  {
    path: '/seller',
    name: 'SellerLayout',
    component: () => import('@/components/layout/SellerLayout.vue'),
    meta: { requiresAuth: true, requiresRole: 'seller' },
    children: [
      {
        path: '',
        name: 'SellerDashboard',
        component: () => import('@/views/seller/Dashboard.vue'),
        meta: { title: '卖家工作台' },
      },
      {
        path: 'products',
        name: 'SellerProducts',
        component: () => import('@/views/seller/ProductManage.vue'),
        meta: { title: '商品管理' },
      },
      {
        path: 'product/add',
        name: 'SellerProductAdd',
        component: () => import('@/views/seller/ProductAdd.vue'),
        meta: { title: '添加商品' },
      },
      {
        path: 'orders',
        name: 'SellerOrders',
        component: () => import('@/views/seller/OrderManage.vue'),
        meta: { title: '订单管理' },
      },
      {
        path: 'shop',
        name: 'SellerShop',
        component: () => import('@/views/seller/ShopManage.vue'),
        meta: { title: '店铺管理' },
      },
    ],
  },
  {
    path: '/seller/apply',
    name: 'SellerApply',
    component: () => import('@/views/seller/ShopApply.vue'),
    meta: { title: '店铺入驻', requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('@/components/layout/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin' },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '管理后台' },
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UserManage.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/ProductReview.vue'),
        meta: { title: '商品审核' },
      },
      {
        path: 'product-manage',
        name: 'AdminProductManage',
        component: () => import('@/views/admin/ProductManage.vue'),
        meta: { title: '商品管理' },
      },
      {
        path: 'shops',
        name: 'AdminShops',
        component: () => import('@/views/admin/ShopReview.vue'),
        meta: { title: '店铺审核' },
      },
      {
        path: 'shop-manage',
        name: 'AdminShopManage',
        component: () => import('@/views/admin/ShopManage.vue'),
        meta: { title: '店铺管理' },
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/CategoryManage.vue'),
        meta: { title: '分类管理' },
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/OrderManage.vue'),
        meta: { title: '订单管理' },
      },
      {
        path: 'banners',
        name: 'AdminBanners',
        component: () => import('@/views/admin/BannerManage.vue'),
        meta: { title: '轮播图管理' },
      },
      {
        path: 'members',
        name: 'AdminMembers',
        component: () => import('@/views/admin/MemberManage.vue'),
        meta: { title: '会员列表' },
      },
      {
        path: 'member-levels',
        name: 'AdminMemberLevels',
        component: () => import('@/views/admin/MemberLevelManage.vue'),
        meta: { title: '会员等级配置' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFound.vue'),
    meta: { title: '404' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || '网上商城系统'

  const userStore = useUserStore()

  if (to.meta.requiresAuth) {
    if (!userStore.isLogin) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
      return
    }

    if (to.meta.requiresRole) {
      const role = to.meta.requiresRole as string
      if (userStore.userInfo?.userRole !== role) {
        next('/')
        return
      }
    }
  }

  next()
})

export default router
