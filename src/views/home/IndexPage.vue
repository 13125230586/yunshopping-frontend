<template>
  <div class="home-page">
    <!-- 主横幅区域：左侧分类 + 中间轮播图 + 右侧推荐 -->
    <div class="main-banner">
      <div class="page-container">
        <div class="banner-wrapper">
          <!-- 左侧分类导航 -->
          <div class="category-nav">
            <div
              v-for="category in categoryStore.categoryTree.slice(0, 12)"
              :key="category.id"
              class="category-nav-item"
              @mouseenter="currentHoverCategory = category"
              @mouseleave="currentHoverCategory = null"
              @click="handleCategoryClick(category.id)"
            >
              <appstore-outlined class="category-icon" />
              <span>{{ category.categoryName }}</span>
              <right-outlined class="arrow-icon" />

              <!-- 子分类展开面板 -->
              <div v-if="currentHoverCategory?.id === category.id && category.children && category.children.length > 0" class="sub-category-panel">
                <div class="sub-category-content">
                  <div
                    v-for="subCategory in category.children"
                    :key="subCategory.id"
                    class="sub-category-group"
                  >
                    <div class="sub-category-title" @click.stop="handleCategoryClick(subCategory.id)">
                      {{ subCategory.categoryName }}
                    </div>
                    <div v-if="subCategory.children && subCategory.children.length > 0" class="sub-category-items">
                      <a
                        v-for="thirdCategory in subCategory.children"
                        :key="thirdCategory.id"
                        class="sub-category-item"
                        @click.stop="handleCategoryClick(thirdCategory.id)"
                      >
                        {{ thirdCategory.categoryName }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 中间轮播图 -->
          <div class="carousel-wrapper">
            <a-carousel autoplay :dot-position="'bottom'">
              <div
                v-for="item in bannerStore.bannerList"
                :key="item.id"
                class="carousel-item"
                @click="handleBannerClick(item)"
              >
                <img
                  :src="item.imageUrl"
                  :alt="item.title"
                  loading="eager"
                  decoding="sync"
                />
                <div class="carousel-overlay">
                  <div class="carousel-title">{{ item.title }}</div>
                </div>
              </div>
            </a-carousel>
          </div>

          <!-- 右侧推荐板块 -->
          <div class="side-panels">
            <!-- 用户信息卡片 -->
            <div class="panel-item panel-user" v-if="!userStore.isLogin">
              <div class="panel-title">Hi，欢迎来到云商城</div>
              <div class="panel-buttons">
                <a-button type="primary" block @click="$router.push('/login')">登录</a-button>
                <a-button block style="margin-top: 8px" @click="$router.push('/register')">注册</a-button>
              </div>
            </div>
            <div class="panel-item panel-user" v-else>
              <div class="panel-title">Hi，{{ userStore.userInfo?.userName }}</div>
              <div class="panel-welcome">欢迎回来！</div>
              <div class="user-quick-links">
                <a @click="$router.push('/user/orders')">我的订单</a>
                <a @click="$router.push('/user/address')">收货地址</a>
              </div>
            </div>

            <!-- 今日推荐商品卡片 -->
            <div class="panel-item panel-product" v-if="recommendProducts.length > 0">
              <div class="panel-product-header">
                <span class="product-tag">今日推荐</span>
              </div>
              <div class="panel-product-content" @click="handleProductClick(recommendProducts[0])">
                <img :src="recommendProducts[0].mainImageUrl" :alt="recommendProducts[0].productName" />
                <div class="product-info">
                  <div class="product-name">{{ recommendProducts[0].productName }}</div>
                  <div class="product-price">¥{{ recommendProducts[0].price?.toFixed(2) }}</div>
                </div>
              </div>
            </div>

            <!-- 快捷功能入口 -->
            <div class="panel-item panel-shortcuts">
              <div class="shortcuts-grid">
                <div class="shortcut-item" @click="$router.push('/products?sortField=sales&sortOrder=desc')">
                  <fire-outlined class="shortcut-icon" style="color: #ff4d4f" />
                  <span>热销榜单</span>
                </div>
                <div class="shortcut-item" @click="$router.push('/products?sortField=price&sortOrder=asc')">
                  <gift-outlined class="shortcut-icon" style="color: #52c41a" />
                  <span>超值特惠</span>
                </div>
              </div>
            </div>

            <!-- 平台公告 -->
            <div class="panel-item panel-notice">
              <div class="notice-header">
                <notification-outlined class="notice-icon" />
                <span>平台公告</span>
              </div>
              <div class="notice-content">
                <p>🎉 新用户注册即送优惠券</p>
                <p>📦 全场满299包邮</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门商品区域 -->
    <div class="product-section-wrapper">
      <div class="page-container">
        <section class="product-section">
          <div class="section-header">
            <h2 class="section-title">猜你喜欢</h2>
            <div class="section-subtitle">精选好物推荐</div>
            <a-button type="link" class="more-link" @click="$router.push('/products')">
              查看更多 >>
            </a-button>
          </div>
          <a-spin :spinning="productStore.loading">
            <div class="product-grid">
              <product-card
                v-for="product in productStore.productList"
                :key="product.id"
                :product="product"
              />
            </div>
          </a-spin>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  AppstoreOutlined,
  RightOutlined,
  FireOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  StarOutlined,
  NotificationOutlined,
} from '@ant-design/icons-vue'
import { useCategoryStore } from '@/stores/category'
import { useProductStore } from '@/stores/product'
import { useUserStore } from '@/stores/user'
import { useBannerStore } from '@/stores/banner'
import ProductCard from '@/components/business/ProductCard.vue'
import type { Banner, Product } from '@/types/models'

const router = useRouter()
const categoryStore = useCategoryStore()
const productStore = useProductStore()
const userStore = useUserStore()
const bannerStore = useBannerStore()

const currentHoverCategory = ref(null)

const recommendProducts = computed(() => {
  return productStore.productList.slice(0, 1)
})

onMounted(async () => {
  await bannerStore.fetchBannerList()
  await categoryStore.fetchCategoryTree()
  await productStore.fetchProductList({
    current: 1,
    pageSize: 12,
    status: 1,
    reviewStatus: 1,
  })
})

const handleCategoryClick = (categoryId: number) => {
  router.push({
    path: '/products',
    query: { categoryId },
  })
}

const handleBannerClick = (banner: Banner) => {
  switch (banner.linkType) {
    case 'category':
      router.push({
        path: '/products',
        query: { categoryId: banner.linkValue },
      })
      break
    case 'product':
      router.push({
        path: `/product/${banner.linkValue}`,
      })
      break
    case 'shop':
      router.push({
        path: `/shop/${banner.linkValue}`,
      })
      break
    case 'url':
      if (banner.linkValue) {
        window.open(banner.linkValue, '_blank')
      }
      break
  }
}

const handleProductClick = (product: Product) => {
  router.push(`/product/${product.id}`)
}
</script>

<style scoped lang="less">
.home-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.page-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
}

.main-banner {
  background: #f5f5f5;
  padding: 20px 0;
  margin-top: 60px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  width: 100%;

  .banner-wrapper {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    position: relative;
  }

  .category-nav {
    width: 200px;
    height: 460px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    padding: 8px 0;
    flex-shrink: 0;
    position: relative;
    z-index: 2;

    .category-nav-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        padding-left: 20px;
      }

      .category-icon {
        margin-right: 12px;
        font-size: 16px;
      }

      span {
        flex: 1;
        font-size: 14px;
        white-space: nowrap;
      }

      .arrow-icon {
        font-size: 12px;
        opacity: 0.6;
      }

      .sub-category-panel {
        position: absolute;
        left: 100%;
        top: 0;
        width: 600px;
        min-height: 460px;
        background: #fff;
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
        border-radius: 0 4px 4px 0;
        z-index: 10;
        margin-left: 0;

        .sub-category-content {
          padding: 20px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px 32px;
        }

        .sub-category-group {
          .sub-category-title {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin-bottom: 12px;
            cursor: pointer;
            transition: color 0.3s;

            &:hover {
              color: #1890ff;
            }
          }

          .sub-category-items {
            display: flex;
            flex-wrap: wrap;
            gap: 8px 12px;
          }

          .sub-category-item {
            font-size: 13px;
            color: #666;
            cursor: pointer;
            transition: color 0.3s;
            white-space: nowrap;

            &:hover {
              color: #1890ff;
            }
          }
        }
      }
    }
  }

  .carousel-wrapper {
    flex: 1;
    height: 460px;
    border-radius: 4px;
    overflow: hidden;
    background: #f0f0f0;

    .carousel-item {
      height: 460px;
      cursor: pointer;
      position: relative;
      background: #000;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
      }

      .carousel-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
        padding: 40px 30px 20px;
        transform: translateY(0);
        transition: all 0.3s ease;

        .carousel-title {
          color: #fff;
          font-size: 28px;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          line-height: 1.4;
          opacity: 1;
          transform: translateY(0);
          transition: all 0.3s ease;
        }
      }

      &:hover {
        .carousel-overlay {
          padding-bottom: 30px;

          .carousel-title {
            transform: translateY(-5px);
          }
        }
      }
    }
  }

  .side-panels {
    width: 300px;
    height: 460px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-shrink: 0;
    overflow: hidden;

    .panel-item {
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &.panel-user {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        color: #fff;
        min-height: 120px;
        cursor: default;

        .panel-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .panel-buttons {
          display: flex;
          flex-direction: column;
        }

        .panel-welcome {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 12px;
        }

        .user-quick-links {
          display: flex;
          gap: 16px;
          margin-top: 8px;

          a {
            color: #fff;
            font-size: 13px;
            opacity: 0.9;
            cursor: pointer;
            transition: opacity 0.3s;
            text-decoration: underline;

            &:hover {
              opacity: 1;
            }
          }
        }
      }

      &.panel-product {
        background: #fff;
        padding: 0;
        overflow: hidden;
        height: 160px;

        .panel-product-header {
          padding: 12px 16px;
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);

          .product-tag {
            color: #fff;
            font-size: 14px;
            font-weight: bold;
          }
        }

        .panel-product-content {
          display: flex;
          padding: 12px;
          cursor: pointer;

          img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
            background: #f5f5f5;
          }

          .product-info {
            flex: 1;
            margin-left: 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .product-name {
              font-size: 14px;
              color: #333;
              margin-bottom: 8px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              line-height: 1.4;
            }

            .product-price {
              font-size: 18px;
              color: #ff4d4f;
              font-weight: bold;
            }
          }
        }

        &:hover .panel-product-content {
          background: #fafafa;
        }
      }

      &.panel-shortcuts {
        background: #fff;
        padding: 16px;
        cursor: default;
        height: auto;

        .shortcuts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;

          .shortcut-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 16px 8px;
            background: #f5f5f5;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;

            .shortcut-icon {
              font-size: 24px;
              margin-bottom: 8px;
            }

            span {
              font-size: 12px;
              color: #666;
              text-align: center;
            }

            &:hover {
              background: #e6f7ff;
              transform: translateY(-2px);
            }
          }
        }
      }

      &.panel-notice {
        background: #fff;
        padding: 16px;
        cursor: default;
        height: auto;

        .notice-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f0f0f0;

          .notice-icon {
            color: #1890ff;
            font-size: 16px;
            margin-right: 8px;
          }

          span {
            font-size: 14px;
            font-weight: bold;
            color: #333;
          }
        }

        .notice-content {
          p {
            font-size: 13px;
            color: #666;
            line-height: 1.6;
            margin: 0 0 8px 0;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }

      &.panel-promo {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;

        &:nth-child(3) {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &:nth-child(4) {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        &:nth-child(5) {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        .promo-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .promo-subtitle {
          font-size: 14px;
          opacity: 0.9;
        }
      }
    }
  }
}

.product-section-wrapper {
  background: #fff;
  width: 100%;
  padding: 20px 0 40px;
}

.product-section {
  padding: 0;

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 16px;

    .section-title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin: 0;
      margin-right: 12px;
    }

    .section-subtitle {
      font-size: 14px;
      color: #999;
      flex: 1;
    }

    .more-link {
      font-size: 14px;
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}
</style>
