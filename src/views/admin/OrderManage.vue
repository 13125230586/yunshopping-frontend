<template>
  <div class="order-manage">
    <a-card title="订单管理">
      <a-form layout="inline" style="margin-bottom: 16px">
        <a-form-item label="订单号">
          <a-input
            v-model:value="searchForm.orderNo"
            placeholder="请输入订单号"
            style="width: 200px"
            @pressEnter="handleSearch"
          />
        </a-form-item>
        <a-form-item label="订单状态">
          <a-select
            v-model:value="searchForm.orderStatus"
            placeholder="请选择订单状态"
            style="width: 150px"
            allowClear
          >
            <a-select-option :value="0">待支付</a-select-option>
            <a-select-option :value="1">待发货</a-select-option>
            <a-select-option :value="2">待收货</a-select-option>
            <a-select-option :value="3">已完成</a-select-option>
            <a-select-option :value="4">已取消</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :dataSource="orders"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'totalAmount'">
            ¥{{ record.totalAmount?.toFixed(2) }}
          </template>
          <template v-else-if="column.key === 'orderStatus'">
            <a-tag v-if="record.orderStatus === 0" color="orange">待支付</a-tag>
            <a-tag v-else-if="record.orderStatus === 1" color="blue">待发货</a-tag>
            <a-tag v-else-if="record.orderStatus === 2" color="cyan">待收货</a-tag>
            <a-tag v-else-if="record.orderStatus === 3" color="green">已完成</a-tag>
            <a-tag v-else color="red">已取消</a-tag>
          </template>
          <template v-else-if="column.key === 'createTime'">
            {{ formatTime(record.createTime) }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleViewDetail(record)">详情</a-button>
              <a-popconfirm
                v-if="record.orderStatus === 0"
                title="确定删除该订单吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="detailModalVisible"
      title="订单详情"
      width="800px"
      :footer="null"
    >
      <a-descriptions v-if="currentOrder" bordered :column="2">
        <a-descriptions-item label="订单号">
          {{ currentOrder.orderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="订单状态">
          <a-tag v-if="currentOrder.orderStatus === 0" color="orange">待支付</a-tag>
          <a-tag v-else-if="currentOrder.orderStatus === 1" color="blue">待发货</a-tag>
          <a-tag v-else-if="currentOrder.orderStatus === 2" color="cyan">待收货</a-tag>
          <a-tag v-else-if="currentOrder.orderStatus === 3" color="green">已完成</a-tag>
          <a-tag v-else color="red">已取消</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="买家昵称">
          {{ currentOrder.userNickname || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="店铺名称">
          {{ currentOrder.shopName || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="商品总价">
          ¥{{ currentOrder.totalAmount?.toFixed(2) }}
        </a-descriptions-item>
        <a-descriptions-item label="运费">
          ¥{{ (currentOrder.shippingFee || 0).toFixed(2) }}
        </a-descriptions-item>
        <a-descriptions-item label="收货人">
          {{ currentOrder.receiverName || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="联系电话">
          {{ currentOrder.receiverPhone || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="收货地址" :span="2">
          {{ currentOrder.receiverAddress || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="买家留言" :span="2">
          {{ currentOrder.userMessage || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ formatTime(currentOrder.createTime) }}
        </a-descriptions-item>
        <a-descriptions-item label="支付时间">
          {{ currentOrder.payTime ? formatTime(currentOrder.payTime) : '-' }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { listOrderByPageUsingPost, deleteOrderUsingPost } from '@/api/orderController'

const orders = ref([])
const loading = ref(false)
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
})

const searchForm = reactive({
  orderNo: '',
  orderStatus: undefined,
})

const columns = [
  { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 180 },
  { title: '买家昵称', dataIndex: 'userNickname', key: 'userNickname', width: 120 },
  { title: '店铺名称', dataIndex: 'shopName', key: 'shopName', width: 150 },
  { title: '订单金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120 },
  { title: '订单状态', dataIndex: 'orderStatus', key: 'orderStatus', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 150 },
]

const detailModalVisible = ref(false)
const currentOrder = ref<any>(null)

onMounted(() => {
  fetchOrderList()
})

const fetchOrderList = async () => {
  loading.value = true
  try {
    const res = await listOrderByPageUsingPost({
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
      orderNo: searchForm.orderNo || undefined,
      orderStatus: searchForm.orderStatus,
    })
    if (res.code === 0 && res.data) {
      orders.value = res.data.records || []
      pagination.value.total = res.data.total || 0
    }
  } catch (error) {
    console.error('获取订单列表失败 orderNo:', searchForm.orderNo, 'orderStatus:', searchForm.orderStatus, error)
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchOrderList()
}

const handleSearch = () => {
  pagination.value.current = 1
  fetchOrderList()
}

const handleReset = () => {
  searchForm.orderNo = ''
  searchForm.orderStatus = undefined
  pagination.value.current = 1
  fetchOrderList()
}

const handleViewDetail = (record: any) => {
  currentOrder.value = record
  detailModalVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    const res = await deleteOrderUsingPost({ orderId: id })
    if (res.code === 0) {
      message.success('删除成功')
      fetchOrderList()
    } else {
      message.error(res.message || '删除失败')
    }
  } catch (error: any) {
    message.error(error.message || '删除失败')
  }
}

const formatTime = (time: string | undefined) => {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
</script>

<style scoped lang="less">
.order-manage {
  :deep(.ant-table-cell) {
    vertical-align: middle;
  }
}
</style>
