<template>
  <div class="user-orders">
    <a-card title="我的订单">
      <a-table :dataSource="orderStore.orderList" :columns="columns" :loading="orderStore.loading" rowKey="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'orderNo'">
            <a @click="handleViewDetail(record.id)">{{ record.orderNo }}</a>
          </template>
          <template v-if="column.key === 'orderStatus'">
            <a-tag :color="getStatusColor(record.orderStatus)">
              {{ getStatusText(record.orderStatus) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'payAmount'">
            {{ formatPrice(record.payAmount) }}
          </template>
          <template v-if="column.key === 'createTime'">
            {{ formatDate(record.createTime) }}
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button v-if="record.orderStatus === 0" type="primary" size="small">去支付</a-button>
              <a-button v-if="record.orderStatus === 3" size="small" @click="handleConfirm(record.id)">确认收货</a-button>
              <a-button v-if="record.orderStatus === 0" size="small" @click="handleCancel(record.id)">取消订单</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useOrderStore } from '@/stores/order'
import { OrderStatusText } from '@/constants'
import { formatPrice, formatDate } from '@/utils'

const orderStore = useOrderStore()

const columns = [
  { title: '订单号', key: 'orderNo', dataIndex: 'orderNo' },
  { title: '店铺', key: 'shopName', dataIndex: 'shopName' },
  { title: '订单状态', key: 'orderStatus' },
  { title: '订单金额', key: 'payAmount' },
  { title: '下单时间', key: 'createTime' },
  { title: '操作', key: 'action', width: 200 },
]

onMounted(() => {
  orderStore.fetchOrderList({ current: 1, pageSize: 10 })
})

const getStatusText = (status: number) => {
  return OrderStatusText[status as keyof typeof OrderStatusText] || '未知'
}

const getStatusColor = (status: number) => {
  const colors: Record<number, string> = {
    0: 'red',
    1: 'blue',
    2: 'orange',
    3: 'cyan',
    4: 'green',
    5: 'default',
    6: 'purple',
    7: 'default',
  }
  return colors[status] || 'default'
}

const handleViewDetail = (orderId: number) => {
  console.log('查看订单详情', orderId)
}

const handleConfirm = async (orderId: number) => {
  try {
    await orderStore.confirmReceipt(orderId)
    message.success('确认收货成功')
  } catch (error: any) {
    message.error(error.message || '操作失败')
  }
}

const handleCancel = async (orderId: number) => {
  try {
    await orderStore.cancelOrder(orderId)
    message.success('取消订单成功')
  } catch (error: any) {
    message.error(error.message || '操作失败')
  }
}
</script>
