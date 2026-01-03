<template>
  <div class="shop-review">
    <a-card title="店铺审核">
      <a-table
        :dataSource="shops"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'shopLogo'">
            <img :src="record.shopLogo" alt="店铺Logo" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px" />
          </template>
          <template v-else-if="column.key === 'shopStatus'">
            <a-tag v-if="record.shopStatus === 0" color="orange">待审核</a-tag>
            <a-tag v-else-if="record.shopStatus === 1" color="green">已通过</a-tag>
            <a-tag v-else-if="record.shopStatus === 2" color="red">已拒绝</a-tag>
            <a-tag v-else color="gray">已关闭</a-tag>
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
import { listShopByPageUsingPost, reviewShopUsingPost } from '@/api/shopController'

const shops = ref([])
const loading = ref(false)
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

const columns = [
  { title: '店铺Logo', dataIndex: 'shopLogo', key: 'shopLogo', width: 80 },
  { title: '店铺名称', dataIndex: 'shopName', key: 'shopName' },
  { title: '店铺描述', dataIndex: 'shopDescription', key: 'shopDescription', ellipsis: true },
  { title: '状态', dataIndex: 'shopStatus', key: 'shopStatus', width: 100 },
  { title: '操作', key: 'action', width: 180 },
]

const rejectModalVisible = ref(false)
const rejectMessage = ref('')
const currentShop = ref<any>(null)

onMounted(() => {
  fetchShopList()
})

const fetchShopList = async () => {
  loading.value = true
  try {
    const res = await listShopByPageUsingPost({
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
      shopStatus: 0,
    })
    if (res.code === 0 && res.data) {
      shops.value = res.data.records || []
      pagination.value.total = res.data.total || 0
    }
  } catch (error) {
    console.error('获取店铺列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchShopList()
}

const handleReview = async (record: any, reviewStatus: number) => {
  try {
    const res = await reviewShopUsingPost({
      id: record.id,
      reviewStatus: reviewStatus,  // 正确的字段名
      reviewMessage: '审核通过',
    })
    if (res.code === 0) {
      message.success('审核成功')
      fetchShopList()
    } else {
      message.error(res.message || '审核失败')
    }
  } catch (error: any) {
    console.error('店铺审核失败 shopId:', record.id, 'reviewStatus:', reviewStatus, error)
    message.error(error.message || '审核失败')
  }
}

const showRejectModal = (record: any) => {
  currentShop.value = record
  rejectMessage.value = ''
  rejectModalVisible.value = true
}

const handleReject = async () => {
  if (!rejectMessage.value) {
    message.error('请输入拒绝原因')
    return
  }

  try {
    const res = await reviewShopUsingPost({
      id: currentShop.value.id,
      reviewStatus: 2,  // 正确的字段名
      reviewMessage: rejectMessage.value,
    })
    if (res.code === 0) {
      message.success('审核成功')
      rejectModalVisible.value = false
      fetchShopList()
    } else {
      message.error(res.message || '审核失败')
    }
  } catch (error: any) {
    console.error('店铺拒绝失败', error)
    message.error(error.message || '审核失败')
  }
}
</script>
