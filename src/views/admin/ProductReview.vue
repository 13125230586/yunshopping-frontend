<template>
  <div class="product-review">
    <a-card title="商品审核">
      <a-table
        :dataSource="products"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'mainImageUrl'">
            <img :src="record.mainImageUrl" alt="商品图片" style="width: 60px; height: 60px; object-fit: cover" />
          </template>
          <template v-else-if="column.key === 'price'">
            ¥{{ record.price?.toFixed(2) }}
          </template>
          <template v-else-if="column.key === 'reviewStatus'">
            <a-tag v-if="record.reviewStatus === 0" color="orange">待审核</a-tag>
            <a-tag v-else-if="record.reviewStatus === 1" color="green">已通过</a-tag>
            <a-tag v-else color="red">已拒绝</a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="primary" size="small" @click="handleReview(record, 1)">通过</a-button>
              <a-button danger size="small" @click="showRejectModal(record)">拒绝</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="rejectModalVisible"
      title="拒绝审核"
      @ok="handleReject"
      @cancel="rejectModalVisible = false"
    >
      <a-form-item label="拒绝原因">
        <a-textarea
          v-model:value="rejectMessage"
          placeholder="请输入拒绝原因"
          :rows="4"
        />
      </a-form-item>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { listProductByPageUsingPost, reviewProductUsingPost } from '@/api/productController'

const products = ref([])
const loading = ref(false)
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

const columns = [
  { title: '商品图片', dataIndex: 'mainImageUrl', key: 'mainImageUrl', width: 100 },
  { title: '商品名称', dataIndex: 'productName', key: 'productName' },
  { title: '价格', dataIndex: 'price', key: 'price', width: 120 },
  { title: '店铺', dataIndex: 'shopName', key: 'shopName' },
  { title: '状态', dataIndex: 'reviewStatus', key: 'reviewStatus', width: 100 },
  { title: '操作', key: 'action', width: 180 },
]

const rejectModalVisible = ref(false)
const rejectMessage = ref('')
const currentProduct = ref<any>(null)

onMounted(() => {
  fetchProductList()
})

const fetchProductList = async () => {
  loading.value = true
  try {
    const res = await listProductByPageUsingPost({
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
      reviewStatus: 0,
    })
    if (res.code === 0 && res.data) {
      products.value = res.data.records || []
      pagination.value.total = res.data.total || 0
    }
  } catch (error) {
    console.error('获取商品列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchProductList()
}

const handleReview = async (record: any, reviewStatus: number) => {
  try {
    const res = await reviewProductUsingPost({
      id: record.id,
      reviewStatus,
      reviewMessage: '审核通过',
    })
    if (res.code === 0) {
      message.success('审核成功')
      fetchProductList()
    } else {
      message.error(res.message || '审核失败')
    }
  } catch (error: any) {
    message.error(error.message || '审核失败')
  }
}

const showRejectModal = (record: any) => {
  currentProduct.value = record
  rejectMessage.value = ''
  rejectModalVisible.value = true
}

const handleReject = async () => {
  if (!rejectMessage.value) {
    message.error('请输入拒绝原因')
    return
  }

  try {
    const res = await reviewProductUsingPost({
      id: currentProduct.value.id,
      reviewStatus: 2,
      reviewMessage: rejectMessage.value,
    })
    if (res.code === 0) {
      message.success('审核成功')
      rejectModalVisible.value = false
      fetchProductList()
    } else {
      message.error(res.message || '审核失败')
    }
  } catch (error: any) {
    message.error(error.message || '审核失败')
  }
}
</script>
