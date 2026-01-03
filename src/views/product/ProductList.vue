<template>
  <div class="product-list-page">
    <div class="page-container">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card title="筛选条件" class="filter-card">
            <a-form layout="vertical">
              <a-form-item label="价格区间">
                <a-input-group compact>
                  <a-input-number
                    v-model:value="searchParams.minPrice"
                    placeholder="最低价"
                    style="width: 50%"
                  />
                  <a-input-number
                    v-model:value="searchParams.maxPrice"
                    placeholder="最高价"
                    style="width: 50%"
                  />
                </a-input-group>
              </a-form-item>
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="handleSearch">搜索</a-button>
                  <a-button @click="handleReset">重置</a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
        <a-col :span="18">
          <a-card class="product-card">
            <template #title>
              <div class="card-title-wrapper">
                <span>商品列表</span>
                <span class="total-count">共 {{ productStore.total }} 件商品</span>
                <a-tag v-if="searchParams.categoryId" color="blue" closable @close="handleClearCategory">
                  分类ID: {{ searchParams.categoryId }}
                </a-tag>
                <a-tag v-if="searchParams.searchText" color="green" closable @close="handleClearSearch">
                  搜索: {{ searchParams.searchText }}
                </a-tag>
              </div>
            </template>
            <template #extra>
              <a-radio-group v-model:value="sortType" @change="handleSortChange">
                <a-radio-button value="default">默认</a-radio-button>
                <a-radio-button value="price-asc">价格升序</a-radio-button>
                <a-radio-button value="price-desc">价格降序</a-radio-button>
              </a-radio-group>
            </template>
            <a-spin :spinning="productStore.loading">
              <div class="product-grid">
                <product-card
                  v-for="product in productStore.productList"
                  :key="product.id"
                  :product="product"
                />
              </div>
              <a-empty v-if="!productStore.loading && productStore.productList.length === 0">
                <template #description>
                  <div>
                    <p>未找到符合条件的商品</p>
                    <p v-if="searchParams.categoryId" style="color: #999; font-size: 12px; margin-top: 8px;">
                      当前筛选: 分类ID={{ searchParams.categoryId }}, 上架状态=1, 审核状态=1
                    </p>
                  </div>
                </template>
              </a-empty>
              <a-pagination
                v-model:current="searchParams.current"
                v-model:page-size="searchParams.pageSize"
                :total="productStore.total"
                :show-total="(total: number) => `共 ${total} 条`"
                show-size-changer
                show-quick-jumper
                @change="handlePageChange"
                @show-size-change="handlePageSizeChange"
                class="pagination"
              />
            </a-spin>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/product'
import ProductCard from '@/components/business/ProductCard.vue'

const route = useRoute()
const productStore = useProductStore()

const sortType = ref('default')

const searchParams = reactive({
  current: 1,
  pageSize: 12,
  categoryId: undefined as number | undefined,
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  sortField: undefined as string | undefined,
  sortOrder: undefined as string | undefined,
  searchText: undefined as string | undefined,
  status: 1,
  reviewStatus: 1,
})

onMounted(async () => {
  if (route.query.keyword) {
    searchParams.searchText = route.query.keyword as string
  }
  if (route.query.categoryId) {
    searchParams.categoryId = Number(route.query.categoryId)
  }
  await fetchProducts()
})

watch(() => route.query, (newQuery) => {
  if (newQuery.keyword) {
    searchParams.searchText = newQuery.keyword as string
  } else {
    searchParams.searchText = undefined
  }

  if (newQuery.categoryId) {
    searchParams.categoryId = Number(newQuery.categoryId)
  } else {
    searchParams.categoryId = undefined
  }

  searchParams.current = 1
  fetchProducts()
})

const fetchProducts = async () => {
  await productStore.fetchProductList(searchParams)
}

const handleSortChange = () => {
  switch (sortType.value) {
    case 'price-asc':
      searchParams.sortField = 'price'
      searchParams.sortOrder = 'asc'
      break
    case 'price-desc':
      searchParams.sortField = 'price'
      searchParams.sortOrder = 'desc'
      break
    default:
      searchParams.sortField = undefined
      searchParams.sortOrder = undefined
  }
  searchParams.current = 1
  fetchProducts()
}

const handleSearch = () => {
  searchParams.current = 1
  fetchProducts()
}

const handleReset = () => {
  searchParams.minPrice = undefined
  searchParams.maxPrice = undefined
  searchParams.sortField = undefined
  searchParams.sortOrder = undefined
  sortType.value = 'default'
  searchParams.current = 1
  fetchProducts()
}

const handlePageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchProducts()
}

const handlePageSizeChange = (_current: number, size: number) => {
  searchParams.current = 1
  searchParams.pageSize = size
  fetchProducts()
}

const handleClearCategory = () => {
  searchParams.categoryId = undefined
  searchParams.current = 1
  fetchProducts()
}

const handleClearSearch = () => {
  searchParams.searchText = undefined
  searchParams.current = 1
  fetchProducts()
}
</script>

<style scoped lang="less">
.product-list-page {
  background: #f5f5f5;
  min-height: calc(100vh - 264px);
  padding: 60px 0 24px;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.filter-card {
  position: sticky;
  top: 120px;
}

.product-card {
  margin-top: 0;
}

.total-count {
  margin-left: 16px;
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>
