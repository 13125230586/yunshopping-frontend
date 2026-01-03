<template>
  <div class="product-manage">
    <a-button type="primary" @click="$router.push('/seller/product/add')" style="margin-bottom: 16px">
      添加商品
    </a-button>
    <a-table :dataSource="productList" :columns="columns" :loading="loading" rowKey="id" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import type { Product } from '@/types/models'

const productStore = useProductStore()
const productList = ref<Product[]>([])
const loading = ref(false)

const columns = [
  { title: '商品名称', dataIndex: 'productName', key: 'productName' },
  { title: '价格', dataIndex: 'price', key: 'price' },
  { title: '库存', dataIndex: 'stock', key: 'stock' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action' },
]

onMounted(async () => {
  loading.value = true
  await productStore.fetchProductList({ current: 1, pageSize: 10 })
  productList.value = productStore.productList
  loading.value = false
})
</script>
